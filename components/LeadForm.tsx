"use client";

import { FormEvent, useState } from "react";
import { Send } from "lucide-react";

export function LeadForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const params = new URLSearchParams(window.location.search);
    const utmParams = Object.fromEntries(
      Array.from(params.entries()).filter(([key]) => key.startsWith("utm_"))
    );
    const payload = {
      ...Object.fromEntries(formData.entries()),
      sourcePage: window.location.pathname,
      utmParams
    };

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("Lead submission failed");
      }

      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form className="lead-form" id="get-my-cash-offer" onSubmit={handleSubmit}>
      <p className="form-kicker">Private property review</p>
      <h2>See What Your Options Could Look Like</h2>
      <p>
        Share the basics. Michael will review the situation privately and
        follow up with a clear next step.
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
            placeholder="Tell us about repairs, tenants, inheritance, timing, or anything important."
          />
        </div>
        <button className="button field-full" type="submit" disabled={status === "submitting"}>
          <Send size={18} aria-hidden="true" />
          {status === "submitting" ? "Sending..." : "Request My Offer"}
        </button>
      </div>
      <div className="form-status" aria-live="polite">
        {status === "success" && "Thanks. Your property review request was received."}
          {status === "error" &&
          "We could not send the form. Please call (888) 626-3213 or email MCobb@RedClayCap.com."}
      </div>
    </form>
  );
}
