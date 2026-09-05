import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { blogPosts, site } from "@/content/site";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((item) => item.slug === slug);

  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `/blog/${post.slug}`
    },
    openGraph: {
      title: `${post.title} | Red Clay Capital`,
      description: post.description,
      url: `${site.url}/blog/${post.slug}`,
      type: "article",
      images: [
        {
          url: site.ogImage,
          alt: "Red Clay Capital logo"
        }
      ]
    }
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = blogPosts.find((item) => item.slug === slug);

  if (!post) notFound();

  const related = (post.related || [])
    .map((relatedSlug) => blogPosts.find((item) => item.slug === relatedSlug))
    .filter(Boolean) as typeof blogPosts;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    mainEntityOfPage: `${site.url}/blog/${post.slug}`,
    publisher: {
      "@type": "Organization",
      name: site.name,
      url: site.url,
      logo: `${site.url}${site.ogImage}`
    }
  };

  return (
    <main className="page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([articleSchema, { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: site.url }, { "@type": "ListItem", position: 2, name: "Seller resources", item: `${site.url}/blog` }, { "@type": "ListItem", position: 3, name: post.title, item: `${site.url}/blog/${post.slug}` }] }]).replace(/</g, "\\u003c") }}
      />
      <SiteHeader />

      <article className="article-page">
        <header className="subpage-hero article-hero" id="main-content" tabIndex={-1}>
          <div className="container">
            <p className="eyebrow">{post.eyebrow}</p>
            <h1>{post.title}</h1>
            <p className="hero-copy">{post.description}</p>
            <div className="article-meta">
              <span>{post.category}</span>
              <span>{post.readTime}</span>
            </div>
          </div>
        </header>

        <section className="section">
          <div className="container article-layout">
            <div className="article-content">
              {post.sections.map((section) => (
                <section key={section.heading}>
                  <h2>{section.heading}</h2>
                  {section.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </section>
              ))}
              {post.sources && <section><h2>Official resources</h2><p>For procedural questions, use current official guidance and advice appropriate to your property.</p><ul>{post.sources.map((source) => <li key={source.href}><a href={source.href}>{source.label}</a></li>)}</ul></section>}
              <section><h2>Make the next step specific to your property</h2><p>Find the <a href="/areas-we-serve/north-carolina">North Carolina</a>, <a href="/areas-we-serve/georgia">Georgia</a>, or <a href="/areas-we-serve/ohio">Ohio</a> guide, or see <a href="/how-it-works">how a review works</a>. Requesting an offer is separate from accepting one.</p></section>
            </div>
            <aside className="article-sidebar">
              <div className="subpage-contact">
                <h2>Have a property like this?</h2>
                <p>
                  Tell us about the address, condition, occupancy, and your
                  preferred timing. A review does not commit you to a sale.
                </p>
                <a className="button" href="/get-offer">
                  Request an offer
                  <ArrowRight size={18} aria-hidden="true" />
                </a>
                <a href={site.phoneHref}>Call {site.phone}</a>
                <a href={site.smsHref}>Text {site.phone}</a>
              </div>
              {related.length > 0 && (
                <div className="related-articles">
                  <h3>Related articles</h3>
                  {related.map((item) => (
                    <a href={`/blog/${item.slug}`} key={item.slug}>
                      <span>{item.category}</span>
                      {item.title}
                    </a>
                  ))}
                </div>
              )}
            </aside>
          </div>
        </section>
      </article>
      <SiteFooter />
    </main>
  );
}
