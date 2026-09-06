import { publicContact } from "./publicContact";
import { cleanText, INTERNET_LEAD_CONSENT_VERSION, INTERNET_LEAD_CONTRACT_VERSION, INTERNET_LEAD_FORM_NAME, INTERNET_LEAD_FORM_VERSION, splitName, type WebsiteLeadPayload } from "./internetLeadContract";

export const ATTRIBUTION_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "gbraid", "wbraid", "fbclid", "msclkid"] as const;
const campaignKeys = new Set<string>(ATTRIBUTION_KEYS);
// Match the receiving RCI contract so a locally accepted email cannot fail downstream validation.
const contactEmailPattern = /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/;

/** Drop arbitrary query strings, fragments and credentials; only HTTP(S) URLs are retained. */
export function sanitizeLeadUrl(value: unknown, originOnly = false): string {
  const input = cleanText(value, 2000);
  if (!input) return "";
  try {
    const url = new URL(input, "https://redclaycap.com");
    if (!/^https?:$/.test(url.protocol) || url.username || url.password) return "";
    return originOnly ? url.origin : `${url.origin}${url.pathname}`;
  } catch { return ""; }
}

export function sanitizeAttribution(value: unknown): Record<string, string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const result: Record<string, string> = {};
  for (const [key, raw] of Object.entries(value)) {
    if (!campaignKeys.has(key) || typeof raw !== "string") continue;
    const text = raw.trim();
    // Campaign labels and IDs only; reject common email, URL and phone contamination.
    if (!text || text.length > 200 || !/^[a-zA-Z0-9_.~ -]+$/.test(text) || /\b\d{3}[- .]?\d{3}[- .]?\d{4}\b/.test(text)) continue;
    result[key] = text;
  }
  return result;
}

export function sanitizeAttributionTouch(value: unknown): Record<string, string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const record = value as Record<string, unknown>;
  const result = sanitizeAttribution(record);
  for (const key of ["landingPageUrl", "pageUrl", "landingPath"] as const) {
    const url = sanitizeLeadUrl(record[key]);
    if (url) result[key] = key === "landingPath" ? new URL(url).pathname : url;
  }
  const referrer = sanitizeLeadUrl(record.referringUrl || record.referrer, true);
  if (referrer) result.referringUrl = referrer;
  return result;
}

export class LeadValidationError extends Error {
  status: number;
  constructor(message: string, status = 400) { super(message); this.name = "LeadValidationError"; this.status = status; }
}

/** Limit bytes actually read, including chunked requests with no content-length. */
export async function readLeadRequest(request: Request, maximum = 32_768): Promise<unknown> {
  if (Number(request.headers.get("content-length")) > maximum) throw new LeadValidationError("Submission is too large. Please shorten your message.", 413);
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) throw new LeadValidationError("Check the form and try again.", 415);
  const reader = request.body?.getReader();
  if (!reader) throw new LeadValidationError("Check the form and try again.");
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maximum) { await reader.cancel(); throw new LeadValidationError("Submission is too large. Please shorten your message.", 413); }
      chunks.push(value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
    return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
  } catch (error) {
    if (error instanceof LeadValidationError) throw error;
    throw new LeadValidationError("Check the form and try again.");
  } finally { reader.releaseLock(); }
}

export function buildWebsiteLeadPayload(value: unknown): WebsiteLeadPayload {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new LeadValidationError("Check the form and try again.");
  const body = value as Record<string, unknown>;
  if (cleanText(body.company, 100)) throw new LeadValidationError(`We could not accept this form. Please clear the company field or call ${publicContact.phone}.`);
  const fullName = cleanText(body.name, 200);
  const address = cleanText(body.address, 500);
  const phone = cleanText(body.phone, 80);
  const digits = phone.replace(/\D/g, "");
  const email = cleanText(body.email, 320).toLowerCase();
  if (fullName.length < 2 || address.length < 5 || (!phone && !email) || (phone && (!/^[+()\d\s.-]+$/.test(phone) || !(digits.length === 10 || (digits.length === 11 && digits.startsWith("1"))))) || (email && !contactEmailPattern.test(email))) throw new LeadValidationError("Enter your name, property address, and a valid phone number or email.");
  const preference = cleanText(body.preferredContactMethod, 40);
  if (!["phone", "sms", "email"].includes(preference) || (preference === "email" ? !email : !phone)) throw new LeadValidationError("Choose a contact preference and enter its phone number or email.");
  if (body.consent !== true) throw new LeadValidationError("Please agree to contact about your property inquiry before submitting.");
  if (body.consentVersion !== INTERNET_LEAD_CONSENT_VERSION) throw new LeadValidationError("Please refresh the form to review the current contact permission.");
  const submissionId = cleanText(body.submissionId, 100);
  const submittedAt = cleanText(body.submittedAt, 40);
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(submissionId) || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(submittedAt) || !Number.isFinite(Date.parse(submittedAt)) || new Date(submittedAt).toISOString() !== submittedAt) throw new LeadValidationError("Please refresh the form and try again.");
  const names = splitName(fullName);
  const attribution = sanitizeAttribution(body.attribution);
  const landingPageUrl = sanitizeLeadUrl(body.landingPageUrl);
  return {
    contractVersion: INTERNET_LEAD_CONTRACT_VERSION, externalSubmissionId: submissionId, submittedAt,
    contact: { fullName, ...names, phone, email, preferredContactMethod: preference },
    property: { address, line1: cleanText(body.addressLine1, 300), line2: cleanText(body.addressLine2, 120), city: cleanText(body.city, 120), state: cleanText(body.state, 40), postalCode: cleanText(body.postalCode, 20) },
    inquiry: { message: cleanText(body.details, 5000), motivation: cleanText(body.motivation), timeline: cleanText(body.timeline, 200), occupancy: cleanText(body.occupancy, 200), askingPrice: cleanText(body.askingPrice, 100), propertyCondition: cleanText(body.propertyCondition) },
    form: { name: INTERNET_LEAD_FORM_NAME, version: INTERNET_LEAD_FORM_VERSION, pageVariant: cleanText(body.pageVariant, 120).replace(/[^a-zA-Z0-9_/-]/g, "") },
    attribution: { source: attribution.utm_source || "unknown", medium: attribution.utm_medium || "", campaign: attribution.utm_campaign || "", term: attribution.utm_term || "", content: attribution.utm_content || "", landingPageUrl, referringUrl: sanitizeLeadUrl(body.referringUrl, true), firstTouch: sanitizeAttributionTouch(body.firstTouch), latestTouch: sanitizeAttributionTouch(body.latestTouch), gclid: attribution.gclid || "", gbraid: attribution.gbraid || "", wbraid: attribution.wbraid || "", fbclid: attribution.fbclid || "", msclkid: attribution.msclkid || "", sessionId: "" },
    consent: { provided: true, disclosureVersion: INTERNET_LEAD_CONSENT_VERSION, capturedAt: submittedAt, formName: INTERNET_LEAD_FORM_NAME, pageUrl: sanitizeLeadUrl(body.pageUrl) || landingPageUrl, channels: [preference as "phone" | "sms" | "email"] },
    // Stable on retry; database createdAt is the authoritative server acceptance time.
    technical: { sourceWebsite: "redclaycap.com", acceptedAt: submittedAt },
  };
}
