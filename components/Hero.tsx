import { ArrowRight, BadgeCheck, Building2, FileCheck2, Home, LockKeyhole, MapPin, ShieldCheck } from "lucide-react";
import { LeadForm } from "./LeadForm";

export function Hero() {
  return (
    <section className="hero">
      <div className="container hero-grid">
        <div className="hero-content">
          <p className="eyebrow">North Carolina real estate acquisitions</p>
          <h1>Professional Solutions For Complicated Property Sales.</h1>
          <p className="hero-copy">
            Red Clay Capital acquires residential properties with repairs,
            tenants, fire damage, title issues, existing financing, vacancy,
            inheritance, or other distress through a private and structured
            review process.
          </p>
          <div className="hero-actions">
            <a className="button" href="#get-my-cash-offer">
              Request Acquisition Review
              <ArrowRight size={18} aria-hidden="true" />
            </a>
            <a className="button secondary" href="#situations">
              View Property Situations
            </a>
          </div>
          <div className="hero-trust-line">
            <ShieldCheck size={22} aria-hidden="true" />
            <span>Private Review</span>
            <span>As-Is Acquisition</span>
            <span>Professional Closing</span>
          </div>
          <p className="privacy-note">
            <LockKeyhole size={16} aria-hidden="true" /> No public listing, showings, or repair requirement.
          </p>
        </div>
        <div className="hero-visual corporate-visual" aria-label="Red Clay Capital acquisition platform overview">
          <div className="capital-card main-capital-card">
            <div>
              <span>Red Clay Capital, LLC</span>
              <strong>Acquisition Review</strong>
            </div>
            <p>Condition, occupancy, title, financing, and timeline evaluated before terms are presented.</p>
          </div>
          <div className="capital-metrics">
            <article>
              <Building2 size={22} aria-hidden="true" />
              <strong>NC Markets</strong>
              <span>Raleigh, Durham, Triad, Coastal, and central NC</span>
            </article>
            <article>
              <FileCheck2 size={22} aria-hidden="true" />
              <strong>Complex Files</strong>
              <span>Tenants, title, fire damage, liens, subject-to, seller finance</span>
            </article>
            <article>
              <BadgeCheck size={22} aria-hidden="true" />
              <strong>Closing Coordination</strong>
              <span>Professional closing partners and written terms</span>
            </article>
          </div>
          <div className="capital-stack" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>
      <div className="container hero-panel">
        <div className="offer-trust-strip" aria-label="Seller trust standards">
          <span>As-Is Acquisitions</span>
          <span>Cash or Structured Terms</span>
          <span>Tenant-Occupied Properties</span>
          <span>Damaged Homes</span>
          <span>Remote Closings Available</span>
        </div>
        <LeadForm />
        <div className="hero-proof" aria-label="Red Clay Capital trust signals">
          <div className="hero-proof-item">
            <Home size={24} aria-hidden="true" />
            <div>
              <strong>No Repairs</strong>
              <span>Sell as-is, in any condition.</span>
            </div>
          </div>
          <div className="hero-proof-item">
            <MapPin size={24} aria-hidden="true" />
            <div>
              <strong>NC Market Coverage</strong>
              <span>Focused across North Carolina.</span>
            </div>
          </div>
          <div className="hero-proof-item">
            <BadgeCheck size={24} aria-hidden="true" />
            <div>
              <strong>Clear Terms</strong>
              <span>Review written options privately.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
