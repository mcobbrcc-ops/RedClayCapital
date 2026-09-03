import { randomUUID } from "node:crypto";
import { after, type NextRequest } from "next/server";
import { cleanText, INTERNET_LEAD_CONSENT_VERSION, INTERNET_LEAD_CONTRACT_VERSION, INTERNET_LEAD_FORM_NAME, INTERNET_LEAD_FORM_VERSION, splitName, type WebsiteLeadPayload } from "@/lib/internetLeadContract";
import { deliverWebsiteLeadOutbox, durablyAcceptWebsiteLead } from "@/lib/internetLeadOutbox";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type PublicFormBody = Record<string, unknown> & {
  attribution?: Record<string, unknown>;
  firstTouch?: Record<string, unknown>;
  latestTouch?: Record<string, unknown>;
};

function safeMap(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(Object.entries(value as Record<string, unknown>).slice(0, 30).map(([key, item]) => [cleanText(key, 80), cleanText(item, 2000)]).filter(([key]) => key));
}

function validEmail(value: string) {
  return !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.length === 10 || (digits.length === 11 && digits.startsWith("1"));
}

export async function POST(request: NextRequest) {
  const length = Number(request.headers.get("content-length") || "0");
  if (length > 65_536) return Response.json({ ok: false, error: "Submission is too large" }, { status: 413 });
  let body: PublicFormBody;
  try {
    body = await request.json() as PublicFormBody;
  } catch {
    return Response.json({ ok: false, error: "Check the form and try again" }, { status: 400 });
  }
  if (cleanText(body.company, 100)) {
    return Response.json({ ok: true, queued: false, reference: randomUUID() }, { status: 202 });
  }
  const fullName = cleanText(body.name, 200);
  const address = cleanText(body.address, 500);
  const phone = cleanText(body.phone, 80);
  const email = cleanText(body.email, 320).toLowerCase();
  if (!fullName || !address || (!phone && !email) || (phone && !validPhone(phone)) || !validEmail(email)) {
    return Response.json({ ok: false, error: "Enter a name, property address, and a valid phone or email" }, { status: 400 });
  }
  const now = new Date().toISOString();
  const names = splitName(fullName);
  const attribution = safeMap(body.attribution);
  const consentProvided = body.consent === true || body.consent === "true" || body.consent === "on";
  const payload: WebsiteLeadPayload = {
    contractVersion: INTERNET_LEAD_CONTRACT_VERSION,
    externalSubmissionId: randomUUID(),
    submittedAt: now,
    contact: {
      fullName,
      firstName: names.firstName,
      lastName: names.lastName,
      phone,
      email,
      preferredContactMethod: cleanText(body.preferredContactMethod, 40),
    },
    property: {
      address,
      line1: cleanText(body.addressLine1, 300),
      line2: cleanText(body.addressLine2, 120),
      city: cleanText(body.city, 120),
      state: cleanText(body.state, 40),
      postalCode: cleanText(body.postalCode, 20),
    },
    inquiry: {
      message: cleanText(body.details, 5000),
      motivation: cleanText(body.motivation, 500),
      timeline: cleanText(body.timeline, 200),
      occupancy: cleanText(body.occupancy, 200),
      askingPrice: cleanText(body.askingPrice, 100),
      propertyCondition: cleanText(body.propertyCondition, 500),
    },
    form: {
      name: INTERNET_LEAD_FORM_NAME,
      version: INTERNET_LEAD_FORM_VERSION,
      pageVariant: cleanText(body.pageVariant, 120),
    },
    attribution: {
      source: cleanText(attribution.utm_source || attribution.source, 500),
      medium: cleanText(attribution.utm_medium || attribution.medium, 500),
      campaign: cleanText(attribution.utm_campaign || attribution.campaign, 500),
      term: cleanText(attribution.utm_term || attribution.term, 500),
      content: cleanText(attribution.utm_content || attribution.content, 500),
      landingPageUrl: cleanText(body.landingPageUrl, 2000),
      referringUrl: cleanText(body.referringUrl, 2000),
      firstTouch: safeMap(body.firstTouch),
      latestTouch: safeMap(body.latestTouch),
      gclid: cleanText(attribution.gclid, 500),
      gbraid: cleanText(attribution.gbraid, 500),
      wbraid: cleanText(attribution.wbraid, 500),
      fbclid: cleanText(attribution.fbclid, 500),
      msclkid: cleanText(attribution.msclkid, 500),
      sessionId: cleanText(body.sessionId, 500),
    },
    consent: {
      provided: consentProvided,
      disclosureVersion: INTERNET_LEAD_CONSENT_VERSION,
      capturedAt: now,
      formName: INTERNET_LEAD_FORM_NAME,
      pageUrl: cleanText(body.landingPageUrl, 2000),
      channels: consentProvided ? ["phone", "sms", "email"] : [],
    },
    technical: { sourceWebsite: "redclaycap.com", acceptedAt: now },
  };
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "";
  try {
    const accepted = await durablyAcceptWebsiteLead(payload, { ip: forwarded, userAgent: request.headers.get("user-agent") || "" });
    after(async () => {
      try { await deliverWebsiteLeadOutbox(5); }
      catch (error) { console.warn("[redclaycap] Durable lead delivery deferred", { errorClass: error instanceof Error ? error.name : "unknown_error" }); }
    });
    return Response.json({ ok: true, queued: accepted.submission_status !== "DELIVERED", reference: payload.externalSubmissionId }, { status: 202 });
  } catch (error) {
    console.error("[redclaycap] Durable lead acceptance failed", { errorClass: error instanceof Error ? error.name : "unknown_error" });
    return Response.json({ ok: false, error: "We could not safely preserve your request. Please call (888) 626-3213." }, { status: 503, headers: { "retry-after": "30" } });
  }
}
