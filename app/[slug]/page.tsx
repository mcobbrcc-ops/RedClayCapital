import type { Metadata } from "next";
import { ArrowRight, CheckCircle2, Mail, MapPin } from "lucide-react";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SellerFeedbackBand } from "@/components/TestimonialSections";
import { cityPages, localSeoPages, servicePages, site } from "@/content/site";
import { getPublicTestimonials } from "@/lib/testimonialStore";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return [...servicePages, ...localSeoPages].map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = [...servicePages, ...localSeoPages].find((item) => item.slug === slug);

  if (!page) {
    return {};
  }

  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: `/${page.slug}`
    },
    openGraph: {
      title: `${page.title} | Red Clay Capital`,
      description: page.description,
      url: `${site.url}/${page.slug}`,
      images: [
        {
          url: site.founderImage,
          width: 1262,
          height: 1262,
          alt: "Michael Cobb, founder of Red Clay Capital"
        }
      ]
    }
  };
}

export default async function ServicePage({ params }: PageProps) {
  const { slug } = await params;
  const page = [...servicePages, ...localSeoPages].find((item) => item.slug === slug);
  const testimonials = await getPublicTestimonials();

  if (!page) {
    notFound();
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: site.url
      },
      {
        "@type": "ListItem",
        position: 2,
        name: page.title,
        item: `${site.url}/${page.slug}`
      }
    ]
  };
  const topicReview =
    testimonials.find((testimonial) =>
      page.title.toLowerCase().includes("fast") && testimonial.tags?.includes("Fast Closing")
    ) ||
    testimonials.find((testimonial) =>
      page.title.toLowerCase().includes("choose") && testimonial.tags?.includes("Transparency")
    ) ||
    testimonials.find((testimonial) => testimonial.featured) ||
    testimonials[0];

  return (
    <main className="page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <SiteHeader />

      <section className="subpage-hero">
        <div className="container subpage-grid">
          <div>
            <p className="eyebrow">{page.eyebrow}</p>
            <h1>{page.title}</h1>
            <p className="hero-copy">{page.description}</p>
            <div className="hero-actions">
              <a className="button" href="/#get-my-cash-offer">
                Request a Property Review
                <ArrowRight size={18} aria-hidden="true" />
              </a>
              <a className="button secondary" href="/#faq">
                Read FAQ
              </a>
            </div>
          </div>
          <aside className="subpage-contact">
            <MapPin size={26} aria-hidden="true" />
            <h2>Talk With {site.founder}</h2>
            <p>
              Send the property address and a short summary of the situation.
              Your review is private and there is no obligation.
            </p>
            <a href={`mailto:${site.email}`}>
              <Mail size={18} aria-hidden="true" />
              {site.email}
            </a>
            <a href="tel:+18886263213">
              Call {site.phone}
            </a>
          </aside>
        </div>
      </section>

      <section className="section">
        <div className="container content-page">
          <div>
            <p className="eyebrow">What homeowners should know</p>
            <h2>Clear Guidance Before You Decide</h2>
          </div>
          <div className="content-stack">
            {page.sections.map((section) => (
              <p key={section}>{section}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <div className="section-heading">
            <h2>{page.slug === "areas-we-serve" ? "North Carolina Areas We Serve" : "Related Search Topics"}</h2>
            <p className="muted">
              {page.slug === "areas-we-serve"
                ? "Choose your city to learn how Red Clay Capital helps homeowners compare private, as-is sale options."
                : "These are the types of homeowner questions this page is designed to answer clearly and naturally."}
            </p>
          </div>
          {page.slug === "areas-we-serve" ? (
            <div className="resource-grid">
              {cityPages.map((city) => (
                <a className="resource city-link" href={city.href ?? `/areas-we-serve/${city.slug}`} key={city.slug}>
                  <span>{city.city}, {city.state}</span>
                  <h3>{city.title}</h3>
                  <p className="muted">{city.description}</p>
                </a>
              ))}
            </div>
          ) : (
            <div className="feature-list light-list">
              {page.keywords.map((keyword) => (
                <div className="feature" key={keyword}>
                  <CheckCircle2 size={20} aria-hidden="true" />
                  <span>{keyword}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      {topicReview && <SellerFeedbackBand testimonial={topicReview} />}
      <SiteFooter />
    </main>
  );
}
