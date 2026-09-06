import { sanitizeAttribution, sanitizeAttributionTouch, sanitizeLeadUrl } from "./internetLeadValidation";

type Touch = Record<string, string>;
type TrackingConfig = { gaId?: string; gtmId?: string };
type TrackerWindow = Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void };
let first: Touch | undefined;
let latest: Touch | undefined;
let trackingAllowed = false;
let provider: "ga" | "gtm" | undefined;
let measurementId: string | undefined;
const conversionReceipts = new Set<string>();
const acquisitionKey = "rcc.acquisition.v2";
const receiptKey = "rcc.conversions.v1";

export function configureSiteTracking({ gaId, gtmId }: TrackingConfig) {
  // Match SiteExperience: one provider owns events even if both IDs are configured.
  provider = gtmId ? "gtm" : gaId ? "ga" : undefined;
  measurementId = gaId;
}
export function allowTracking(value: boolean) { trackingAllowed = value; }
export function captureTouch() {
  if (typeof window === "undefined") return;
  const tags = sanitizeAttribution(Object.fromEntries(new URLSearchParams(window.location.search)));
  const touch = { ...tags, landingPageUrl: sanitizeLeadUrl(window.location.href), referringUrl: sanitizeLeadUrl(document.referrer, true) };
  try {
    const raw = sessionStorage.getItem(acquisitionKey);
    const saved = raw && raw.length <= 8_192 ? JSON.parse(raw) : undefined;
    if (!first && saved?.first) {
      const restored = sanitizeAttributionTouch(saved.first);
      if (restored.landingPageUrl) first = restored;
    }
    if (!latest && saved?.latest) {
      const restored = sanitizeAttributionTouch(saved.latest);
      if (restored.landingPageUrl) latest = restored;
    }
  } catch { /* Submission works with storage blocked. */ }
  first ||= touch;
  if (!latest || Object.keys(tags).length) latest = touch;
  try { sessionStorage.setItem(acquisitionKey, JSON.stringify({ first, latest })); } catch {}
  return { attribution: sanitizeAttribution(latest), firstTouch: { ...first }, latestTouch: { ...latest, pageUrl: sanitizeLeadUrl(window.location.href) }, landingPageUrl: first.landingPageUrl, pageUrl: sanitizeLeadUrl(window.location.href), referringUrl: first.referringUrl };
}
export type SiteEvent = "form_start" | "form_details_open" | "form_validation_error" | "generate_lead" | "call_tap" | "text_tap" | "offer_cta";

export function trackingPageContext(pathname: string) {
  const pageType = pathname === "/get-offer" ? "offer" : /^\/areas(?:-we-serve)?\//.test(pathname) ? "market" : /^\/(?:blog|resources)\//.test(pathname) ? "guide" : pathname === "/" ? "home" : "other";
  const safePath = { offer: "/get-offer", market: "/areas-we-serve", guide: "/blog", home: "/", other: "/site" }[pageType];
  // Never forward a raw pathname, query, fragment, title, referrer or receipt into general analytics.
  return { page_type: pageType, page_location: `https://redclaycap.com${safePath}`, page_referrer: "", page_title: "Red Clay Capital" };
}

const placements = new Set(["header", "footer", "contact_card", "mobile_actions", "lead_form", "confirmation", "content"]);
export function sanitizeCtaPlacement(value: unknown) {
  return typeof value === "string" && placements.has(value) ? value : "unknown";
}
function acquisitionBucket(value: unknown) {
  const source = typeof value === "string" ? value.toLowerCase() : "";
  if (["google", "bing", "duckduckgo", "yahoo"].includes(source)) return "search";
  if (["facebook", "instagram", "meta", "linkedin", "pinterest"].includes(source)) return "social";
  if (["email", "newsletter"].includes(source)) return "email";
  if (["partner", "referral"].includes(source)) return "referral";
  return "unknown";
}
function mediumBucket(value: unknown) {
  const medium = typeof value === "string" ? value.toLowerCase() : "";
  if (["cpc", "ppc", "paid", "paid_search", "paid_social"].includes(medium)) return "paid";
  return ["organic", "email", "social", "referral"].includes(medium) ? medium : "unknown";
}
function referrerBucket(value: unknown) {
  try {
    const host = new URL(sanitizeLeadUrl(value, true)).hostname.toLowerCase();
    if (["redclaycap.com", "www.redclaycap.com"].includes(host)) return "internal";
    if (["google.com", "www.google.com", "bing.com", "www.bing.com", "duckduckgo.com", "search.yahoo.com"].includes(host)) return "search";
    if (["facebook.com", "www.facebook.com", "l.facebook.com", "instagram.com", "www.instagram.com", "linkedin.com", "www.linkedin.com", "t.co"].includes(host)) return "social";
    return "external";
  } catch { return "unknown"; }
}
export function contactTapContext(placement?: unknown) {
  const acquisition = captureTouch();
  const tags = sanitizeAttribution(acquisition?.attribution);
  // General analytics gets categories, never user-supplied campaign labels, click IDs or referrer URLs.
  return {
    cta_placement: sanitizeCtaPlacement(placement),
    acquisition_source: acquisitionBucket(tags.utm_source),
    acquisition_medium: mediumBucket(tags.utm_medium),
    first_touch_source: acquisitionBucket(acquisition?.firstTouch?.utm_source),
    referrer_category: referrerBucket(acquisition?.referringUrl),
    campaign_context: tags.utm_campaign ? "tagged" : "unknown",
    attribution_scope: "website_tap",
  };
}
/** Contact intent only: this function never submits a form, imports SMS, or creates a lead. */
export function trackContactTap(channel: "call" | "text", placement?: unknown) {
  if (channel !== "call" && channel !== "text") return Promise.resolve();
  return trackSiteEvent(channel === "call" ? "call_tap" : "text_tap", undefined, placement);
}

async function wasConversionRecorded(reference: string) {
  if (conversionReceipts.has(reference)) return true;
  conversionReceipts.add(reference); // Lock immediately, before asynchronous hashing.
  try {
    const digest = await window.crypto.subtle.digest("SHA-256", new TextEncoder().encode(reference));
    const receiptHash = Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, "0")).join("");
    const raw = sessionStorage.getItem(receiptKey);
    const saved: unknown = raw && raw.length <= 20_000 ? JSON.parse(raw) : [];
    const hashes = Array.isArray(saved) ? saved.filter((item): item is string => typeof item === "string" && /^[a-f0-9]{64}$/.test(item)).slice(-199) : [];
    if (hashes.includes(receiptHash)) return true;
    sessionStorage.setItem(receiptKey, JSON.stringify([...hashes, receiptHash]));
  } catch { /* Memory deduplication still works with storage or crypto unavailable. */ }
  return false;
}

export async function trackSiteEvent(event: SiteEvent, reference?: string, placement?: unknown) {
  if (typeof window === "undefined" || !provider || !trackingAllowed || navigator.doNotTrack === "1") return;
  if (event === "generate_lead" && (!reference || await wasConversionRecorded(reference))) return;
  // Consent may have been withdrawn while hashing the acceptance receipt.
  if (!trackingAllowed || navigator.doNotTrack === "1") return;
  const tracker = window as TrackerWindow;
  const params = { ...trackingPageContext(window.location.pathname), ...(event === "call_tap" || event === "text_tap" ? contactTapContext(placement) : {}) };
  try {
    tracker.dataLayer ||= [];
    if (provider === "gtm") tracker.dataLayer.push({ event, ...params });
    else {
      // Standard gtag queue also works before the external GA script finishes loading.
      tracker.gtag ||= function (..._args: unknown[]) { tracker.dataLayer!.push(arguments); };
      tracker.gtag("event", event, { ...params, send_to: measurementId });
    }
  } catch { /* Analytics errors must never change an accepted form into a failure. */ }
}
