import { ArrowRight } from "lucide-react";
import { FAQ, CTASection, FounderProfile, HowItWorks, ResourceCenter, SituationCards, TrustSection } from "@/components/Sections";
import { Hero } from "@/components/Hero";
import { SiteHeader } from "@/components/SiteHeader";
import { faqs, servicePages, site } from "@/content/site";

function JsonLd() {
  const organization = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: site.name,
    url: site.url,
    email: site.email,
    telephone: site.phone,
    image: `${site.url}${site.founderImage}`,
    founder: {
      "@type": "Person",
      name: site.founder,
      jobTitle: "Founder & Acquisition Specialist",
      email: site.email
    },
    description:
      "Red Clay Capital helps homeowners evaluate as-is cash sale options for difficult property situations.",
    areaServed: [
      "Raleigh NC",
      "Durham NC",
      "Cary NC",
      "Chapel Hill NC",
      "Fayetteville NC",
      "Wilmington NC"
    ],
    sameAs: []
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer
      }
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}

export default function Home() {
  return (
    <main className="page">
      <JsonLd />
      <SiteHeader ctaHref="#get-my-cash-offer" />
      <Hero />
      <SituationCards />
      <HowItWorks />
      <TrustSection />
      <FounderProfile />
      <CTASection />
      <ResourceCenter />
      <FAQ />
      <section className="section dark">
        <div className="container">
          <div className="section-heading">
            <h2>A Simpler Way to Move Forward</h2>
            <p className="muted">
              Tell us about the property and the situation. We will review it
              privately and follow up with the next best step.
            </p>
          </div>
          <a className="button" href="#get-my-cash-offer">
            Request a Cash Offer
            <ArrowRight size={18} aria-hidden="true" />
          </a>
          <div className="internal-links" aria-label="Helpful Red Clay Capital pages">
            {servicePages.slice(0, 6).map((page) => (
              <a href={`/${page.slug}`} key={page.slug}>
                {page.title}
              </a>
            ))}
          </div>
        </div>
      </section>
      <footer className="site-footer">
        <div className="container footer-grid">
          <div>
            <div className="brand">
              <span className="brand-mark" aria-hidden="true">RC</span>
              <span>Red Clay Capital, LLC</span>
            </div>
            <p>
              Private, as-is cash offer options for homeowners facing difficult
              property situations.
            </p>
            <p>Founder: {site.founder}</p>
          </div>
          <div>
            <p>{site.phone}</p>
            <p>{site.email}</p>
          </div>
        </div>
      </footer>
      <a className="button sticky-mobile-cta" href="#get-my-cash-offer">
        Request My Offer
      </a>
    </main>
  );
}
