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
    keywords: post.keywords,
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
          width: 512,
          height: 512,
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <SiteHeader />

      <article className="article-page">
        <header className="subpage-hero article-hero">
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
            </div>
            <aside className="article-sidebar">
              <div className="subpage-contact">
                <h2>Have a property like this?</h2>
                <p>
                  Red Clay Capital can review condition, occupancy, title,
                  financing, and closing timeline privately.
                </p>
                <a className="button" href="/#get-my-cash-offer">
                  Request Review
                  <ArrowRight size={18} aria-hidden="true" />
                </a>
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
