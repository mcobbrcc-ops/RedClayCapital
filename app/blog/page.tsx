import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { blogPosts, site } from "@/content/site";

export const metadata: Metadata = {
  title: "Distressed Property Resource Center",
  description:
    "Human-written guides about selling houses with repairs, tenants, fire damage, code issues, inherited ownership, vacancy, subject-to, seller finance, and foreclosure pressure.",
  alternates: {
    canonical: "/blog"
  }
};

export default function BlogIndexPage() {
  return (
    <main className="page">
      <SiteHeader />
      <section className="subpage-hero blog-hero">
        <div className="container subpage-grid">
          <div>
            <p className="eyebrow">Red Clay Capital resource center</p>
            <h1>Serious Guidance For Complicated Property Situations.</h1>
            <p className="hero-copy">
              Practical articles for owners comparing as-is sales, cash offers,
              subject-to, seller finance, tenant-occupied sales, fire damage,
              code violations, inherited homes, and vacant property risk.
            </p>
            <div className="hero-actions">
              <a className="button" href="/#get-my-cash-offer">
                Request Acquisition Review
                <ArrowRight size={18} aria-hidden="true" />
              </a>
            </div>
          </div>
          <aside className="subpage-contact">
            <h2>Need a direct review?</h2>
            <p>
              Send the address, occupancy status, condition, timeline, and any
              financing or title details to the Red Clay Capital acquisitions
              desk.
            </p>
            <a href={`mailto:${site.email}`}>{site.email}</a>
            <a href="tel:+18886263213">Call {site.phone}</a>
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
