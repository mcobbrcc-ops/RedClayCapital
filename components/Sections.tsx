import Image from "next/image";
import { ArrowRight, CheckCircle2, CircleDollarSign, ClipboardList, MessageSquareText } from "lucide-react";
import { faqs, localSeoPages, process, resources, site, situations, trustPoints } from "@/content/site";

export function SituationCards() {
  return (
    <section className="section alt" id="situations">
      <div className="container">
        <div className="section-heading">
          <h2>Solutions For Real Property Problems</h2>
          <p className="muted">
            Every property has a story. We take time to understand the situation
            before discussing whether a cash offer is the right fit.
          </p>
        </div>
        <div className="card-grid">
          {situations.map((item) => {
            const Icon = item.icon;
            return (
              <article className="card" key={item.title}>
                <Icon size={26} aria-hidden="true" />
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function HowItWorks() {
  const icons = [MessageSquareText, CircleDollarSign, ClipboardList];

  return (
    <section className="section">
      <div className="container">
        <div className="section-heading">
          <h2>A Simple Process Built Around Your Timeline</h2>
          <p className="muted">
            No repairs required. No cleaning required. No agent commissions.
            Flexible closing dates and remote closing options may be available.
          </p>
        </div>
        <div className="steps">
          {process.map((step, index) => {
            const Icon = icons[index];
            return (
              <article className="step" key={step.title}>
                <div className="step-index">0{index + 1}</div>
                <div className="step-icon">
                  <Icon size={28} aria-hidden="true" />
                </div>
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function TrustSection() {
  return (
    <section className="section dark">
      <div className="container">
        <div className="section-heading">
          <h2>Why Homeowners Choose Red Clay Capital</h2>
          <p className="muted">
            Our role is to reduce stress, create clarity, and provide a fair
            path forward when a traditional listing is not the best fit.
          </p>
        </div>
        <div className="feature-list">
          {trustPoints.map((point) => (
            <div className="feature" key={point}>
              <CheckCircle2 size={20} aria-hidden="true" />
              <span>{point}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FounderProfile() {
  return (
    <section className="section alt" id="about">
      <div className="container founder">
        <div className="founder-image">
          <Image
            src={site.founderImage}
            alt="Michael Cobb, founder of Red Clay Capital, standing in the Red Clay Capital office"
            fill
            sizes="(max-width: 980px) 100vw, 42vw"
            priority={false}
          />
        </div>
        <div className="founder-copy">
          <p className="eyebrow">Meet the founder</p>
          <h2>Real People. Real Solutions.</h2>
          <p className="quote">
            {site.founder} founded Red Clay Capital to give North Carolina
            homeowners a more respectful way to solve difficult property
            problems, especially when repairs, tenants, inheritance, title
            questions, or time pressure make a normal sale feel unrealistic.
          </p>
          <div className="founder-contact">
            <strong>{site.founder}</strong>
            <span>Founder & Acquisition Specialist</span>
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </div>
          <div className="trust-grid">
            <div className="trust-item">
              <h3>Clear Communication</h3>
              <p className="muted">You will understand the process, the offer, and your options before deciding.</p>
            </div>
            <div className="trust-item">
              <h3>Private Reviews</h3>
              <p className="muted">Property details are handled discreetly, with no public listing or showings.</p>
            </div>
            <div className="trust-item">
              <h3>Professional Closings</h3>
              <p className="muted">Transactions are coordinated through licensed closing partners.</p>
            </div>
            <div className="trust-item">
              <h3>No Pressure</h3>
              <p className="muted">An offer is one option, not an obligation.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CTASection() {
  return (
    <section className="section">
      <div className="container">
        <div className="cta-band">
          <div>
            <h2>Find Out What Your Options Are</h2>
            <p>
              Whether you are dealing with tenants, repairs, inheritance,
              foreclosure pressure, or simply an unwanted property, Red Clay
              Capital can help you understand your options and move forward.
            </p>
          </div>
          <a className="button light" href="#get-my-cash-offer">
            Start My Property Review
            <ArrowRight size={18} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}

export function ResourceCenter() {
  return (
    <section className="section alt" id="resources">
      <div className="container">
        <div className="section-heading">
          <h2>Helpful Real Estate Guidance For Homeowners</h2>
          <p className="muted">
            Learn how as-is sales, cash offers, repairs, inherited property,
            tenants, and closing timelines work before you decide what to do next.
          </p>
        </div>
        <div className="resource-grid">
          {resources.map((resource) => (
            <a className="resource" href="/blog" key={resource.title}>
              <span>{resource.type}</span>
              <h3>{resource.title}</h3>
              <p className="muted">{resource.copy}</p>
            </a>
          ))}
        </div>
        <div className="card" style={{ marginTop: 18 }}>
          <h3>Local areas we help</h3>
          <p className="muted">
            Red Clay Capital serves homeowners across central North Carolina,
            including Burlington, Graham, Greensboro, Haw River, Roxboro,
            Raleigh, Durham, Cary, Chapel Hill, Fayetteville, and Wilmington.
          </p>
          <div className="local-link-row">
            {localSeoPages.map((page) => (
              <a href={`/${page.slug}`} key={page.slug}>{page.title}</a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function FAQ() {
  return (
    <section className="section" id="faq">
      <div className="container">
        <div className="section-heading">
          <h2>Common Questions From Homeowners</h2>
          <p className="muted">
            These answers are general and educational. Your best option depends
            on the property, timeline, title, and situation.
          </p>
        </div>
        <div className="faq">
          {faqs.map((faq) => (
            <details key={faq.question}>
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
