import { publicContact } from "./publicContact";
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

export class LeadIntakeError extends Error {
  status: number;
  constructor(message: string, status: number) { super(message); this.name = "LeadIntakeError"; this.status = status; }
}

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
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    if (name === "website_accept_lead_outbox" && error?.code === "23505") throw new LeadIntakeError("This request reference already contains different details. Please update the form and submit again.", 409);
    if (name === "website_accept_lead_outbox" && error?.code === "P0001" && /rate limit/.test(error?.message || "")) throw new LeadIntakeError(`Too many requests were received. Please try again later, or call or text ${publicContact.phone}.`, 429);
    throw new Error(`Durable intake is unavailable (${response.status})`);
  }
  return response.json() as Promise<T>;
}

export async function durablyAcceptWebsiteLead(payload: WebsiteLeadPayload, evidence: { ip: string; userAgent: string }) {
  // Acceptance remains available when downstream delivery configuration is being repaired.
  const config = { id: required("WEBSITE_INTEGRATION_ID"), acceptSecret: required("WEBSITE_INTEGRATION_ACCEPT_SECRET") };
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
  let responseBody: Record<string, unknown>;
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
      // Never forward the signed payload or HMAC headers to a redirect destination.
      redirect: "manual",
    });
    responseBody = await response.json().catch(() => ({}));
  } catch (error) {
    await fail(submission, leaseToken, { errorClass: error instanceof DOMException && error.name === "TimeoutError" ? "timeout" : "network", message: "Red Clay Intelligence is temporarily unavailable", retryable: true });
    return { delivered: false, retrying: true };
  }
  if (response.ok && responseBody?.ok === true && typeof responseBody.inquiryId === "string" && responseBody.inquiryId) {
    try { await complete(submission, leaseToken, {
      inquiryId: responseBody.inquiryId,
      contactId: responseBody.contactId,
      propertyId: responseBody.propertyId,
      leadId: responseBody.leadId,
      duplicate: Boolean(responseBody.duplicate),
    }, response.status); }
    catch {
      // A remote write may have succeeded. Retrying the same submission is safe at RCI's unique integration/submission key.
      await fail(submission, leaseToken, { errorClass: "receipt_persistence", message: "Delivery receipt could not be preserved; retry the same submission", retryable: true });
      return { delivered: false, retrying: true };
    }
    return { delivered: true };
  }
  const configurationFailure = (response.status >= 300 && response.status < 400) || [401, 403, 404].includes(response.status);
  const retryable = configurationFailure || response.ok || response.status === 408 || response.status === 409 || response.status === 429 || response.status >= 500;
  await fail(submission, leaseToken, { responseStatus: response.status, errorClass: configurationFailure ? `receiver_configuration_${response.status}` : `http_${response.status}`, message: configurationFailure ? "RCI receiver configuration needs repair; preserve and retry this submission" : retryable ? "Red Clay Intelligence deferred the submission" : "Red Clay Intelligence rejected the submission", retryable });
  return { delivered: false, retrying: retryable, deadLettered: !retryable };
}

export async function deliverWebsiteLeadOutbox(limit = 10) {
  const { rows, leaseToken, config } = await claim(limit);
  // Bounded batch is concurrent so one slow downstream request cannot strand the other leased rows.
  const results = await Promise.all(rows.map(async (submission) => {
    try { return await deliver(submission, leaseToken, config); }
    catch { return { delivered: false, retrying: true }; } // Expired durable leases are reclaimed by the recovery worker.
  }));
  return {
    claimed: rows.length,
    delivered: results.filter((result) => result.delivered).length,
    retrying: results.filter((result) => result.retrying).length,
    deadLettered: results.filter((result) => result.deadLettered).length,
  };
}
