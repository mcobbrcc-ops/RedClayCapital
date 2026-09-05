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

export async function trackSiteEvent(event: SiteEvent, reference?: string) {
  if (typeof window === "undefined" || !provider || !trackingAllowed || navigator.doNotTrack === "1") return;
  if (event === "generate_lead" && (!reference || await wasConversionRecorded(reference))) return;
  // Consent may have been withdrawn while hashing the acceptance receipt.
  if (!trackingAllowed || navigator.doNotTrack === "1") return;
  const tracker = window as TrackerWindow;
  const params = trackingPageContext(window.location.pathname);
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
