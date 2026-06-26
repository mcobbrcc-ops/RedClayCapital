import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { CredibilityBadges, ReviewsExplorer } from "@/components/TestimonialSections";
import { getPublicTestimonials } from "@/lib/testimonialStore";
import { site } from "@/content/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Real Feedback From Property Sellers",
  description:
    "Real property seller feedback for Red Clay Capital, including transparency, fair offers, clear communication, fast closings, and professional follow-through.",
  alternates: {
    canonical: "/reviews"
  },
  openGraph: {
    title: "Real Feedback From Property Sellers | Red Clay Capital",
    description:
      "Verified seller feedback about working with Red Clay Capital.",
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
            <p className="eyebrow">Verified seller feedback</p>
            <h1>Real Feedback From Property Sellers</h1>
            <p className="hero-copy">
              Sellers appreciate that Red Clay Capital explains the offer, tells the truth about where we can perform, and follows through without pressure or last-minute surprises.
            </p>
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
              Fair Offers. Clear Communication. Real Follow-Through. That is the standard sellers should expect from the first conversation to closing.
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
