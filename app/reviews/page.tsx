import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { CredibilityBadges, ReviewsExplorer } from "@/components/TestimonialSections";
import { getPublicTestimonials } from "@/lib/testimonialStore";
import { site } from "@/content/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Red Clay Capital Reviews",
  description:
    "Review examples and future verified homeowner testimonials for Red Clay Capital, including inherited property, repairs, tenants, foreclosure, probate, and damaged homes.",
  alternates: {
    canonical: "/reviews"
  },
  openGraph: {
    title: "Red Clay Capital Reviews",
    description:
      "A trust and reputation page prepared for verified Red Clay Capital homeowner reviews.",
    url: `${site.url}/reviews`,
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

export default async function ReviewsPage() {
  const testimonials = await getPublicTestimonials();

  return (
    <main className="page">
      <SiteHeader />
      <section className="subpage-hero reviews-hero">
        <div className="container subpage-grid">
          <div>
            <p className="eyebrow">Reviews and reputation</p>
            <h1>Real Stories. Real Solutions.</h1>
            <p className="hero-copy">
              Red Clay Capital is building a reputation around patience, transparency, fair offers, and calm solutions for difficult property situations.
            </p>
            <div className="placeholder-note">
              Placeholder testimonials for development only. These examples are not presented as verified customer experiences.
            </div>
            <div className="hero-actions">
              <a className="button" href="/#get-my-cash-offer">
                Request a Property Review
                <ArrowRight size={18} aria-hidden="true" />
              </a>
              <a className="button secondary" href="/why-homeowners-choose-us">
                Why Homeowners Choose Us
              </a>
            </div>
          </div>
          <aside className="subpage-contact review-promise-card">
            <h2>A different kind of cash buyer</h2>
            <p>
              We do not just buy houses. We help people move forward with clear options, respectful communication, and professional closing support.
            </p>
          </aside>
        </div>
      </section>
      <ReviewsExplorer testimonials={testimonials} />
      <CredibilityBadges />
      <SiteFooter />
    </main>
  );
}
