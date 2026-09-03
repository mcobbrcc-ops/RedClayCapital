export const INTERNET_LEAD_CONTRACT_VERSION = "2026-09-02.v1" as const;
export const INTERNET_LEAD_FORM_NAME = "red-clay-capital-acquisition-review";
export const INTERNET_LEAD_FORM_VERSION = "2026-09-02";
export const INTERNET_LEAD_CONSENT_VERSION = "seller-inquiry-contact-v1";

export type WebsiteLeadPayload = {
  contractVersion: typeof INTERNET_LEAD_CONTRACT_VERSION;
  externalSubmissionId: string;
  submittedAt: string;
  contact: {
    fullName: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    preferredContactMethod: string;
  };
  property: { address: string; line1: string; line2: string; city: string; state: string; postalCode: string };
  inquiry: { message: string; motivation: string; timeline: string; occupancy: string; askingPrice: string; propertyCondition: string };
  form: { name: string; version: string; pageVariant: string };
  attribution: {
    source: string; medium: string; campaign: string; term: string; content: string;
    landingPageUrl: string; referringUrl: string; firstTouch: Record<string, string>;
    latestTouch: Record<string, string>; gclid: string; gbraid: string; wbraid: string;
    fbclid: string; msclkid: string; sessionId: string;
  };
  consent: { provided: boolean; disclosureVersion: string; capturedAt: string; formName: string; pageUrl: string; channels: Array<"phone" | "sms" | "email"> };
  technical: { sourceWebsite: "redclaycap.com"; acceptedAt: string };
};

export function stableStringify(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  const record = value as Record<string, unknown>;
  return `{${Object.keys(record).sort().map((key) => `${JSON.stringify(key)}:${stableStringify(record[key])}`).join(",")}}`;
}

export function cleanText(value: unknown, maximum = 500) {
  return typeof value === "string" ? value.trim().replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").slice(0, maximum) : "";
}

export function splitName(fullName: string) {
  const parts = fullName.trim().split(/\s+/);
  return { firstName: parts[0] || "", lastName: parts.slice(1).join(" ") };
}
