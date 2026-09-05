import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { notFound, permanentRedirect } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { blogPosts, cityPages, site } from "@/content/site";
import { cityGuidance, marketPages } from "@/content/markets";

type PageProps = { params: Promise<{ city: string }> };

export function generateStaticParams() {
  return [...marketPages, ...cityPages].map((page) => ({ city: page.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city } = await params;
  const page = marketPages.find((item) => item.slug === city) ?? cityPages.find((item) => item.slug === city);
  if (!page) return {};
  const canonical = "href" in page && page.href ? page.href : `/areas-we-serve/${page.slug}`;
  return {
    title: page.title, description: page.description,
    alternates: { canonical },
    openGraph: { title: `${page.title} | Red Clay Capital`, description: page.description, url: `${site.url}${canonical}`, images: [{ url: site.ogImage, alt: "Red Clay Capital" }] }
  };
}

export default async function AreaPage({ params }: PageProps) {
  const { city: slug } = await params;
  const market = marketPages.find((item) => item.slug === slug);
  const city = cityPages.find((item) => item.slug === slug);
  if (city?.href) permanentRedirect(city.href);
  const page = market ?? city;
  if (!page) notFound();
  const local = city ? cityGuidance[city.slug] : undefined;
  const schema = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site.url },
      { "@type": "ListItem", position: 2, name: "Areas we serve", item: `${site.url}/areas-we-serve` },
      { "@type": "ListItem", position: 3, name: market?.state ?? `${city?.city}, North Carolina`, item: `${site.url}/areas-we-serve/${slug}` }
    ]
  };
  const related = market?.guides ?? (local ? [local.guide, "understanding-an-investor-offer"] : []);
  return (
    <main className="page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
      <SiteHeader />
      <section id="main-content" tabIndex={-1} className="subpage-hero">
        <div className="container subpage-grid">
          <div>
            <p className="eyebrow">{market?.state ?? `${city?.city}, North Carolina`} property owners</p>
            <h1>{page.title}</h1>
            <p className="hero-copy">{market?.introduction ?? page.description}</p>
            <div className="hero-actions"><a className="button" href="/get-offer">Request an offer <ArrowRight size={18} aria-hidden="true" /></a><a className="button secondary" href="/how-it-works">How it works</a></div>
          </div>
          <aside className="subpage-contact"><h2>Start with the property</h2><p>Share your address, the situation, and a way to reach you. We will review whether a potential sale is a fit. No repairs are needed before the conversation.</p><a href={site.phoneHref}>Call {site.phone}</a><a href={site.smsHref}>Text {site.phone}</a><a href={`mailto:${site.email}`}>{site.email}</a></aside>
        </div>
      </section>
      <section className="section">
        <div className="container article-layout">
          <div className="article-content">
            {market ? market.sections.map((section) => <section key={section.heading}><h2>{section.heading}</h2>{section.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</section>) : <section><h2>{local?.heading}</h2>{local?.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}<p>Our <a href="/areas-we-serve/north-carolina">North Carolina guide</a> includes official state resources for inherited property and time-sensitive questions. Coverage is confirmed for each property after review; this page does not imply an office in {city?.city}.</p></section>}
            {market && <section><h2>Official resources for {market.state} owners</h2><p>These resources help you locate the appropriate information and professionals. Requirements depend on the property and situation.</p>{market.sources.map((source) => <p key={source.href}><a href={source.href}>{source.label}</a><br />{source.description}</p>)}</section>}
          </div>
          <aside className="article-sidebar"><div className="subpage-contact"><h2>A useful first checklist</h2><ul>{(market?.checklist ?? local?.checklist ?? []).map((item) => <li key={item}>{item}</li>)}</ul><p>You can start before you have every answer.</p><a className="button" href="/get-offer">Tell us about your property</a></div><div className="related-articles"><h3>Seller resources</h3>{Array.from(new Set(related)).map((guide) => { const post = blogPosts.find((item) => item.slug === guide); return post ? <a href={`/blog/${post.slug}`} key={post.slug}>{post.title}</a> : null; })}<a href="/faq">Questions before requesting an offer</a><a href="/areas-we-serve">All focus markets</a></div></aside>
        </div>
      </section>
      {market?.slug === "north-carolina" && <section className="section alt"><div className="container"><div className="section-heading"><h2>North Carolina city guides</h2><p className="muted">Find a starting point for a property in an existing local guide.</p></div><div className="resource-grid">{cityPages.map((item) => <a className="resource city-link" href={item.href ?? `/areas-we-serve/${item.slug}`} key={item.slug}><span>{item.city}, North Carolina</span><h3>{cityGuidance[item.slug]?.heading}</h3></a>)}</div></div></section>}
      <section className="section alt"><div className="container"><div className="section-heading"><h2>Ready for a property-specific conversation?</h2><p className="muted">Requesting a review is separate from accepting an offer. Compare the written terms before deciding.</p></div><div className="hero-actions"><a className="button" href="/get-offer">Request an offer</a><a className="button secondary" href="/contact">Contact Red Clay Capital</a></div></div></section>
      <SiteFooter />
    </main>
  );
}
