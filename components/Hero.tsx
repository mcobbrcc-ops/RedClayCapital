import Image from "next/image";
import { ArrowRight, BadgeCheck, Home, LockKeyhole, MapPin, ShieldCheck } from "lucide-react";
import { LeadForm } from "./LeadForm";
import { site } from "@/content/site";

export function Hero() {
  return (
    <section className="hero">
      <div className="container hero-grid">
        <div className="hero-content">
          <p className="eyebrow">North Carolina real estate solutions</p>
          <h1>Sell Your Home. Skip The Stress.</h1>
          <p className="hero-copy">
            Red Clay Capital helps homeowners move forward from inherited,
            tenant-occupied, damaged, vacant, or unwanted properties with a
            private, respectful cash offer process.
          </p>
          <div className="hero-actions">
            <a className="button" href="#get-my-cash-offer">
              Get My Offer
              <ArrowRight size={18} aria-hidden="true" />
            </a>
            <a className="button secondary" href="#situations">
              View Situations We Help
            </a>
          </div>
          <div className="hero-trust-line">
            <ShieldCheck size={22} aria-hidden="true" />
            <span>Trusted</span>
            <span>Local</span>
            <span>Transparent</span>
          </div>
          <p className="privacy-note">
            <LockKeyhole size={16} aria-hidden="true" /> Your information is reviewed privately.
          </p>
        </div>
        <div className="hero-visual" aria-label="Red Clay Capital founder profile">
          <div className="hero-founder-frame">
            <Image
              src={site.founderImage}
              alt="Michael Cobb, founder of Red Clay Capital, in the Red Clay Capital office"
              fill
              sizes="(max-width: 980px) 84vw, 42vw"
              priority
            />
          </div>
          <div className="founder-badge">
            <span>{site.founder}</span>
            <strong>Founder & Acquisition Specialist</strong>
            <p>Helping North Carolina homeowners find honest, stress-free real estate solutions.</p>
          </div>
        </div>
      </div>
      <div className="container hero-panel">
        <div className="offer-trust-strip" aria-label="Seller trust standards">
          <span>Patient Communication</span>
          <span>Transparent Offers</span>
          <span>No Pressure</span>
          <span>Fast Closings</span>
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
              <strong>Local & Trusted</strong>
              <span>North Carolina focused.</span>
            </div>
          </div>
          <div className="hero-proof-item">
            <BadgeCheck size={24} aria-hidden="true" />
            <div>
              <strong>No Pressure</strong>
              <span>Review your options privately.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
