import { ArrowRight, CheckCircle2, CircleDollarSign, ClipboardList, MessageSquareText } from "lucide-react";
import { blogPosts, faqs, localSeoPages, process, resources, situations, trustPoints } from "@/content/site";

export function SituationCards() {
  return (
    <section className="section alt" id="situations">
      <div className="container">
        <div className="section-heading">
          <h2>Acquisition Options For Distressed Property Situations</h2>
          <p className="muted">
            Some properties need more than a listing appointment. We evaluate
            condition, occupancy, title, financing, and timing before presenting
            a practical acquisition path.
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
          <h2>A Structured Process Built Around Certainty</h2>
          <p className="muted">
            No repairs required. No cleaning required. No public showings.
            Flexible closing dates, remote closing options, and written terms
            may be available depending on the property.
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
          <h2>Why Sellers Work With Red Clay Capital</h2>
          <p className="muted">
            Our role is to underwrite the transaction clearly, reduce moving
            parts, and provide a credible path forward when a traditional sale
            is not the best fit.
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
      <div className="container founder company-profile">
        <div className="company-origin-panel">
          <p className="eyebrow">Company origin</p>
          <h2>Built For Properties The Traditional Market Does Not Handle Well.</h2>
          <p>
            Red Clay Capital was formed to acquire residential real estate where
            condition, occupancy, financing, title, or timing creates friction.
            The company exists because many sellers need a serious transaction
            path before the property is retail-ready.
          </p>
          <div className="origin-metrics">
            <span>As-Is</span>
            <span>Off-Market</span>
            <span>Complex Files</span>
          </div>
        </div>
        <div className="founder-copy">
          <p className="eyebrow">Operating standards</p>
          <h2>Disciplined Underwriting. Clear Terms. Professional Closings.</h2>
          <p className="quote">
            Our process is built to evaluate the whole transaction: repairs,
            tenants, existing debt, subject-to possibilities, seller finance,
            liens, code issues, title requirements, and the closing timeline.
            Sellers receive a practical proposal only after the file has been
            reviewed for feasibility.
          </p>
          <div className="trust-grid">
            <div className="trust-item">
              <h3>Acquisition Discipline</h3>
              <p className="muted">Every file is reviewed for condition, market, occupancy, title, financing, and closing feasibility.</p>
            </div>
            <div className="trust-item">
              <h3>Private Transactions</h3>
              <p className="muted">Property details are handled discreetly, with no public listing, open houses, or repeated showings.</p>
            </div>
            <div className="trust-item">
              <h3>Professional Closings</h3>
              <p className="muted">Transactions are coordinated through professional closing partners with written milestones.</p>
            </div>
            <div className="trust-item">
              <h3>Flexible Structures</h3>
              <p className="muted">Cash, subject-to, seller finance, or other terms may be reviewed when the situation calls for it.</p>
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
          <h2>Request a Professional Property Review</h2>
          <p>
              Whether you are dealing with difficult tenants, existing
              financing, seller finance questions, fire damage, repairs,
              inheritance, foreclosure pressure, or a property that is no
              longer performing, Red Clay Capital can evaluate the file.
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
          <h2>Distressed Property Resource Center</h2>
          <p className="muted">
            Read practical guidance about as-is sales, tenants, subject-to,
            seller finance, inherited properties, fire damage, code issues,
            vacancy, and closing timelines before deciding what to do next.
          </p>
        </div>
        <div className="resource-grid">
          {resources.map((resource) => (
            <a className="resource" href={resource.href} key={resource.title}>
              <span>{resource.type}</span>
              <h3>{resource.title}</h3>
              <p className="muted">{resource.copy}</p>
            </a>
          ))}
        </div>
        <div className="article-link-grid">
          {blogPosts.slice(3).map((post) => (
            <a href={`/blog/${post.slug}`} key={post.slug}>
              <span>{post.category}</span>
              {post.title}
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
