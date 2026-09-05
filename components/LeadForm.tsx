"use client";
import { FormEvent, useRef, useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { site } from "@/content/site";
import { INTERNET_LEAD_CONSENT_TEXT, INTERNET_LEAD_CONSENT_VERSION } from "@/lib/internetLeadContract";
import { captureTouch, trackSiteEvent } from "@/lib/siteTracking";

export function LeadForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");
  const [preference, setPreference] = useState("phone");
  const inFlight = useRef(false);
  const started = useRef(false);
  const requestBody = useRef<string | null>(null);
  const lastFields = useRef<string | null>(null);
  const messageRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  function fail(message: string) {
    setError(message); setStatus("error");
    requestAnimationFrame(() => messageRef.current?.focus());
  }
  function trackStart() { if (!started.current) { started.current = true; trackSiteEvent("form_start"); } }
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current || status === "success") return;
    const form = event.currentTarget;
    const fields = Object.fromEntries(new FormData(form).entries());
    const phone = String(fields.phone || "").trim();
    const email = String(fields.email || "").trim();
    const digits = phone.replace(/\D/g, "");
    if ((!phone && !email) || (preference === "email" ? !email : !phone)) {
      trackSiteEvent("form_validation_error"); fail("Add a phone number or email that matches how you’d like us to contact you."); return;
    }
    if (phone && (!/^[+()\d\s.-]+$/.test(phone) || !(digits.length === 10 || digits.length === 11 && digits.startsWith("1")))) {
      trackSiteEvent("form_validation_error"); fail("Check your phone number, including the area code, or choose email instead."); return;
    }
    const serializedFields = JSON.stringify(fields);
    if (!requestBody.current || serializedFields !== lastFields.current) {
      requestBody.current = JSON.stringify({ ...fields, consent: fields.consent === "on", consentVersion: INTERNET_LEAD_CONSENT_VERSION, submissionId: crypto.randomUUID(), submittedAt: new Date().toISOString(), ...captureTouch(), pageVariant: location.pathname });
      lastFields.current = serializedFields;
    }
    inFlight.current = true; setStatus("submitting"); setError("");
    try {
      const response = await fetch("/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: requestBody.current, signal: AbortSignal.timeout(25000) });
      const result = await response.json();
      if (!response.ok || result.ok !== true || typeof result.reference !== "string" || !result.reference) throw new Error(result.error || "We couldn’t confirm your request was saved. Retry below or call or text us.");
      setReference(result.reference); setStatus("success");
      trackSiteEvent("generate_lead", result.reference);
      requestAnimationFrame(() => successRef.current?.focus());
    } catch (caught) {
      fail(caught instanceof Error && caught.name !== "TimeoutError" && caught.name !== "TypeError" ? caught.message : "The connection was interrupted. Your details are still here. Retry to check the same request, or call or text us.");
    } finally { inFlight.current = false; }
  }
  if (status === "success") return <div className="lead-form form-success" id="get-my-cash-offer" ref={successRef} tabIndex={-1} role="status"><CheckCircle2 size={34} aria-hidden="true" /><p className="form-kicker">YOUR REQUEST IS SAVED</p><h2>Thank you for reaching out.</h2><p>We’ll review your property details and use your preferred contact method to discuss the next step. An offer depends on that review.</p><p className="receipt">Your reference: <strong>{reference}</strong></p><p>Have something to add? <a className="text-link" href={site.phoneHref}>Call</a> or <a className="text-link" href={site.smsHref}>text {site.phone}</a> and mention your reference.</p><a className="text-link" href="/how-it-works">What happens next →</a></div>;
  return <form className="lead-form" id="get-my-cash-offer" onSubmit={handleSubmit} onFocus={trackStart} onInvalidCapture={() => trackSiteEvent("form_validation_error")} aria-busy={status === "submitting"}>
    <label className="honeypot" aria-hidden="true">Company<input name="company" tabIndex={-1} autoComplete="off" /></label>
    <p className="form-kicker">A FEW DETAILS TO GET STARTED</p><h2>Request an offer.</h2><p>No obligation to sell. Just a starting point for a conversation.</p>
    <fieldset disabled={status === "submitting"} style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}><legend className="sr-only">Property and contact details</legend>
    <div className="field-grid">
      <div className="field field-full"><label htmlFor="address">Property address or location</label><input id="address" name="address" autoComplete="street-address" required minLength={5} maxLength={500} placeholder="Street, city, state and ZIP" /><span className="field-hint">Type it in — no address lookup needed.</span></div>
      <div className="field field-full"><label htmlFor="name">Your name</label><input id="name" name="name" autoComplete="name" required minLength={2} maxLength={200} /></div>
      <div className="field field-full"><label htmlFor="preferredContactMethod">How would you like us to reach you?</label><select id="preferredContactMethod" name="preferredContactMethod" value={preference} onChange={e => setPreference(e.target.value)}><option value="phone">Phone call</option><option value="sms">Text message</option><option value="email">Email</option></select></div>
      <div className="field"><label htmlFor="phone">Phone {preference === "email" ? "(optional)" : "number"}</label><input id="phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" required={preference !== "email"} maxLength={80} placeholder="Including area code" /></div>
      <div className="field"><label htmlFor="email">Email{preference !== "email" ? " (optional)" : " address"}</label><input id="email" name="email" type="email" autoComplete="email" required={preference === "email"} maxLength={320} placeholder="you@example.com" /></div>
    </div>
    <details className="form-details" onToggle={e => { if (e.currentTarget.open) trackSiteEvent("form_details_open"); }}><summary>Add property details (optional)</summary><div className="field-grid">
      <div className="field"><label htmlFor="propertyCondition">Property condition</label><select id="propertyCondition" name="propertyCondition"><option value="">Choose if you’d like</option><option>Move-in ready</option><option>Cosmetic updates</option><option>Major repairs</option><option>Fire, water or storm damage</option><option>Not sure</option></select></div>
      <div className="field"><label htmlFor="timeline">Your timeline</label><select id="timeline" name="timeline"><option value="">Choose if you’d like</option><option>As soon as practical</option><option>Within 1–3 months</option><option>Flexible</option><option>Just exploring</option></select></div>
      <div className="field field-full"><label htmlFor="details">Anything we should know?</label><textarea id="details" name="details" maxLength={5000} placeholder="Your questions, property condition or situation" /></div>
    </div></details>
    <label className="consent-row"><input name="consent" type="checkbox" required /><span>{INTERNET_LEAD_CONSENT_TEXT} <a href="/privacy">Privacy & contact choices</a>.</span></label>
    <button className="button submit-button" type="submit" disabled={status === "submitting"}>{status === "submitting" ? "Saving your request…" : status === "error" ? "Retry request" : "Request an offer"}<ArrowRight size={18} aria-hidden="true" /></button>
    </fieldset>
    {error && <div className="form-error" role="alert" ref={messageRef} tabIndex={-1}>{error}</div>}
    <p className="form-contact">Prefer to talk? <a href={site.phoneHref}>Call</a> or <a href={site.smsHref}>text {site.phone}</a>.</p>
  </form>;
}
