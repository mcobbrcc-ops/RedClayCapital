import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { blogPosts, site } from "@/content/site";

export const metadata: Metadata = {
  title: "Seller Resources: Compare Your Home Sale Options",
  description:
    "Practical guides to as-is offers, repairs, inherited homes, rentals, vacancy, and questions to ask before deciding how to sell.",
  openGraph: { title: "Seller resources | Red Clay Capital", description: "Practical guides to compare your property sale options.", url: `${site.url}/blog`, images: [{ url: site.ogImage, alt: "Red Clay Capital" }] },
  alternates: {
    canonical: "/blog"
  }
};

export default function BlogIndexPage() {
  return (
    <main className="page">
      <SiteHeader />
      <section id="main-content" tabIndex={-1} className="subpage-hero blog-hero">
        <div className="container subpage-grid">
          <div>
            <p className="eyebrow">Red Clay Capital resource center</p>
            <h1>A little clarity before a big decision.</h1>
            <p className="hero-copy">
              Understand the tradeoffs, organize your questions, and compare your
              options. Start with the guide that fits your property and what
              you want to change.
            </p>
            <div className="hero-actions">
              <a className="button" href="/get-offer">
                Request an offer
                <ArrowRight size={18} aria-hidden="true" />
              </a>
            </div>
          </div>
          <aside className="subpage-contact">
            <h2>Want to talk it through?</h2>
            <p>
              You can start with the property location and a short description.
              Explore a potential sale in North Carolina, Georgia, or Ohio
              without committing to an offer.
            </p>
            <a href={`mailto:${site.email}`}>{site.email}</a>
            <a href={site.phoneHref}>Call {site.phone}</a>
            <a href={site.smsHref}>Text {site.phone}</a>
            <a href="/areas-we-serve">Explore your state guide</a>
          </aside>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="blog-grid">
            {blogPosts.map((post) => (
              <a className="blog-card" href={`/blog/${post.slug}`} key={post.slug}>
                <span>{post.category} · {post.readTime}</span>
                <h2>{post.title}</h2>
                <p>{post.description}</p>
                <strong>Read article</strong>
              </a>
            ))}
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
