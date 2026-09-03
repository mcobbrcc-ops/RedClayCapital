"use client";

import { FormEvent, useEffect, useState } from "react";
import { Send } from "lucide-react";

export function LeadForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [reference, setReference] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const touch = Object.fromEntries(Array.from(params.entries()).filter(([key]) => /^(utm_|gclid$|gbraid$|wbraid$|fbclid$|msclkid$)/.test(key)));
    try {
      if (!window.localStorage.getItem("redclay.firstTouch")) window.localStorage.setItem("redclay.firstTouch", JSON.stringify({ ...touch, landingPageUrl: window.location.href, referringUrl: document.referrer }));
      if (!window.sessionStorage.getItem("redclay.leadSession")) window.sessionStorage.setItem("redclay.leadSession", crypto.randomUUID());
    } catch {}
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const params = new URLSearchParams(window.location.search);
    const attribution = Object.fromEntries(Array.from(params.entries()).filter(([key]) => /^(utm_|gclid$|gbraid$|wbraid$|fbclid$|msclkid$)/.test(key)));
    let firstTouch: Record<string, string> = {};
    let sessionId = "";
    try {
      firstTouch = JSON.parse(window.localStorage.getItem("redclay.firstTouch") || "{}") as Record<string, string>;
      sessionId = window.sessionStorage.getItem("redclay.leadSession") || "";
    } catch {}
    const payload = {
      ...Object.fromEntries(formData.entries()),
      attribution,
      firstTouch,
      latestTouch: { ...attribution, landingPageUrl: window.location.href, referringUrl: document.referrer },
      landingPageUrl: window.location.href,
      referringUrl: document.referrer,
      pageVariant: document.body.dataset.pageVariant || window.location.pathname,
      sessionId,
    };

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || "Lead submission failed");

      form.reset();
      setReference(String(result.reference || "").slice(0, 8).toUpperCase());
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form className="lead-form" id="get-my-cash-offer" onSubmit={handleSubmit}>
      <label className="sr-only" aria-hidden="true">Company<input name="company" tabIndex={-1} autoComplete="off" /></label>
      <p className="form-kicker">Private property review</p>
      <h2>Request an Acquisition Review</h2>
      <p>
        Share the basics. Our acquisitions desk will review the file privately
        and follow up with a clear next step.
      </p>
      <div className="field-grid">
        <div className="field field-full">
          <label htmlFor="address">Property address</label>
          <input
            id="address"
            name="address"
            autoComplete="street-address"
            placeholder="123 Main St, Raleigh NC"
            required
          />
        </div>
        <div className="field">
          <label htmlFor="name">Name</label>
          <input id="name" name="name" autoComplete="name" placeholder="Your name" required />
        </div>
        <div className="field">
          <label htmlFor="phone">Phone number</label>
          <input
            id="phone"
            name="phone"
            autoComplete="tel"
            inputMode="tel"
            placeholder="Best number"
            required
          />
        </div>
        <div className="field field-full">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
          />
        </div>
        <label className="field field-full consent-field">
          <span className="inline-flex items-start gap-3 text-sm">
            <input name="consent" type="checkbox" required className="mt-1" />
            <span>I agree that Red Clay Capital may contact me about this property request by phone, text, or email. This does not authorize unrelated or automated marketing.</span>
          </span>
        </label>
        <div className="field">
          <label htmlFor="propertyCondition">Property condition</label>
          <select id="propertyCondition" name="propertyCondition">
            <option value="">Select one</option>
            <option>Move-in ready</option>
            <option>Needs cosmetic updates</option>
            <option>Needs major repairs</option>
            <option>Fire, water, or storm damage</option>
            <option>Vacant or neglected</option>
            <option>Tenant occupied</option>
            <option>Difficult tenants or unauthorized occupants</option>
            <option>Existing mortgage or creative finance question</option>
            <option>Code violations or liens</option>
            <option>Not sure</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="timeline">Timeline to sell</label>
          <select id="timeline" name="timeline">
            <option value="">Select one</option>
            <option>As soon as possible</option>
            <option>Within 30 days</option>
            <option>1-3 months</option>
            <option>Flexible timeline</option>
            <option>Just exploring options</option>
          </select>
        </div>
        <div className="field field-full">
          <label htmlFor="details">Situation or property details</label>
          <textarea
            id="details"
            name="details"
            placeholder="Tell us about repairs, tenants, financing, inheritance, fire damage, code issues, timing, or anything important."
          />
        </div>
        <button className="button field-full" type="submit" disabled={status === "submitting"}>
          <Send size={18} aria-hidden="true" />
          {status === "submitting" ? "Sending..." : "Request Review"}
        </button>
      </div>
      <div className="form-status" aria-live="polite">
        {status === "success" && `Thanks. Your property review request was safely received${reference ? ` (reference ${reference})` : ""}.`}
          {status === "error" &&
          "We could not send the form. Please call (888) 626-3213 or email MCobb@RedClayCap.com."}
      </div>
    </form>
  );
}
