import "server-only";
import { createHash, createHmac, randomUUID } from "node:crypto";
import type { WebsiteLeadPayload } from "./internetLeadContract";
import { stableStringify } from "./internetLeadContract";

type ClaimedSubmission = {
  submission_id: string;
  external_submission_id: string;
  payload: WebsiteLeadPayload;
  payload_hash: string;
  attempt_number: number;
};

function required(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error("Website lead intake needs setup");
  return value;
}

function supabase() {
  return {
    url: required("WEBSITE_OUTBOX_SUPABASE_URL").replace(/\/$/, ""),
    key: required("WEBSITE_OUTBOX_SUPABASE_KEY"),
  };
}

function integration() {
  return {
    id: required("WEBSITE_INTEGRATION_ID"),
    acceptSecret: required("WEBSITE_INTEGRATION_ACCEPT_SECRET"),
    workerSecret: required("WEBSITE_INTEGRATION_WORKER_SECRET"),
    keyId: required("RCI_INTAKE_KEY_ID"),
    hmacSecret: required("RCI_INTAKE_HMAC_SECRET"),
    intakeUrl: new URL(required("RCI_INTAKE_URL")),
  };
}

function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export function privacyHash(value: string) {
  if (!value) return null;
  return createHmac("sha256", required("LEAD_INTAKE_HASH_SALT")).update(value).digest("hex");
}

async function rpc<T>(name: string, body: Record<string, unknown>): Promise<T> {
  const config = supabase();
  const response = await fetch(`${config.url}/rest/v1/rpc/${name}`, {
    method: "POST",
    headers: {
      apikey: config.key,
      authorization: `Bearer ${config.key}`,
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
    signal: AbortSignal.timeout(12_000),
  });
  if (!response.ok) throw new Error(`Durable intake is unavailable (${response.status})`);
  return response.json() as Promise<T>;
}

export async function durablyAcceptWebsiteLead(payload: WebsiteLeadPayload, evidence: { ip: string; userAgent: string }) {
  const config = integration();
  const canonical = stableStringify(payload);
  const result = await rpc<Array<{ submission_id: string; submission_status: string; duplicate: boolean }>>("website_accept_lead_outbox", {
    p_integration_id: config.id,
    p_external_submission_id: payload.externalSubmissionId,
    p_accept_secret: config.acceptSecret,
    p_payload: payload,
    p_payload_hash: sha256(canonical),
    p_ip_hash: privacyHash(evidence.ip),
    p_user_agent_hash: privacyHash(evidence.userAgent),
  });
  const accepted = result[0];
  if (!accepted?.submission_id) throw new Error("Durable intake did not return a receipt");
  return accepted;
}

function canonicalSignature(input: { timestamp: string; nonce: string; bodyHash: string; method: string; pathname: string }) {
  return ["v1", input.timestamp, input.nonce, input.bodyHash, input.method, input.pathname].join("\n");
}

async function claim(limit: number) {
  const config = integration();
  const leaseToken = randomUUID();
  const rows = await rpc<ClaimedSubmission[]>("website_claim_lead_outbox", {
    p_integration_id: config.id,
    p_worker_secret: config.workerSecret,
    p_lease_token: leaseToken,
    p_limit: limit,
  });
  return { rows, leaseToken, config };
}

async function complete(submission: ClaimedSubmission, leaseToken: string, receipt: unknown, responseStatus: number) {
  const config = integration();
  await rpc("website_complete_lead_outbox", {
    p_integration_id: config.id,
    p_worker_secret: config.workerSecret,
    p_submission_id: submission.submission_id,
    p_lease_token: leaseToken,
    p_response_status: responseStatus,
    p_receipt: receipt && typeof receipt === "object" ? receipt : {},
  });
}

async function fail(submission: ClaimedSubmission, leaseToken: string, input: { responseStatus?: number; errorClass: string; message: string; retryable: boolean }) {
  const config = integration();
  await rpc("website_fail_lead_outbox", {
    p_integration_id: config.id,
    p_worker_secret: config.workerSecret,
    p_submission_id: submission.submission_id,
    p_lease_token: leaseToken,
    p_response_status: input.responseStatus ?? null,
    p_error_class: input.errorClass,
    p_error_message: input.message.slice(0, 500),
    p_retryable: input.retryable,
  });
}

async function deliver(submission: ClaimedSubmission, leaseToken: string, config: ReturnType<typeof integration>) {
  const body = stableStringify(submission.payload);
  const bodyHash = sha256(body);
  if (bodyHash !== submission.payload_hash) {
    await fail(submission, leaseToken, { errorClass: "payload_integrity", message: "Stored submission failed its integrity check", retryable: false });
    return { delivered: false, deadLettered: true };
  }
  const timestamp = String(Math.floor(Date.now() / 1000));
  const nonce = randomUUID();
  const signature = createHmac("sha256", config.hmacSecret).update(canonicalSignature({
    timestamp,
    nonce,
    bodyHash,
    method: "POST",
    pathname: config.intakeUrl.pathname,
  })).digest("hex");
  let response: Response;
  try {
    response = await fetch(config.intakeUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-redclay-integration-id": config.id,
        "x-redclay-key-id": config.keyId,
        "x-redclay-timestamp": timestamp,
        "x-redclay-nonce": nonce,
        "x-redclay-content-sha256": bodyHash,
        "x-redclay-signature": signature,
      },
      body,
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });
  } catch (error) {
    await fail(submission, leaseToken, { errorClass: error instanceof DOMException && error.name === "TimeoutError" ? "timeout" : "network", message: "Red Clay Intelligence is temporarily unavailable", retryable: true });
    return { delivered: false, retrying: true };
  }
  const responseBody = await response.json().catch(() => ({}));
  if (response.ok && responseBody?.ok) {
    await complete(submission, leaseToken, {
      inquiryId: responseBody.inquiryId,
      contactId: responseBody.contactId,
      propertyId: responseBody.propertyId,
      leadId: responseBody.leadId,
      duplicate: Boolean(responseBody.duplicate),
    }, response.status);
    return { delivered: true };
  }
  const retryable = response.status === 408 || response.status === 409 || response.status === 429 || response.status >= 500;
  await fail(submission, leaseToken, { responseStatus: response.status, errorClass: `http_${response.status}`, message: retryable ? "Red Clay Intelligence deferred the submission" : "Red Clay Intelligence rejected the submission", retryable });
  return { delivered: false, retrying: retryable, deadLettered: !retryable };
}

export async function deliverWebsiteLeadOutbox(limit = 10) {
  const { rows, leaseToken, config } = await claim(limit);
  const results = [];
  for (const submission of rows) results.push(await deliver(submission, leaseToken, config));
  return {
    claimed: rows.length,
    delivered: results.filter((result) => result.delivered).length,
    retrying: results.filter((result) => result.retrying).length,
    deadLettered: results.filter((result) => result.deadLettered).length,
  };
}
