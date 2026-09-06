import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ContactCard } from "@/components/ContactCard";
import { cityPages, faqs, localSeoPages, servicePages, site } from "@/content/site";
import { cityGuidance, marketPages } from "@/content/markets";

type PageProps = { params: Promise<{ slug: string }> };
const unindexedPages = ["testimonials", "recently-purchased-properties"];

export function generateStaticParams() {
  return [...servicePages, ...localSeoPages].filter((page) => page.slug !== "blog").map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = [...servicePages, ...localSeoPages].find((item) => item.slug === slug);
  if (!page) return {};
  const canonical = slug === "our-buying-process" ? "/how-it-works" : `/${page.slug}`;
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical },
    ...(unindexedPages.includes(slug) ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      title: `${page.title} | Red Clay Capital`, description: page.description,
      url: `${site.url}${canonical}`,
      images: [{ url: site.ogImage, alt: "Red Clay Capital" }]
    }
  };
}

export default async function ServicePage({ params }: PageProps) {
  const { slug } = await params;
  const page = [...servicePages, ...localSeoPages].find((item) => item.slug === slug);
  if (!page) notFound();
  const city = cityPages.find((item) => item.href === `/${slug}`);
  const local = city ? cityGuidance[city.slug] : undefined;
  const schema = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site.url },
      { "@type": "ListItem", position: 2, name: page.title, item: `${site.url}/${slug}` }
    ]
  };
  return (
    <main className="page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
      <SiteHeader />
      <section id="main-content" tabIndex={-1} className="subpage-hero">
        <div className="container subpage-grid">
          <div>
            <p className="eyebrow">{page.eyebrow}</p>
            <h1>{page.title}</h1>
            <p className="hero-copy">{page.description}</p>
            <div className="hero-actions">
              <a className="button" href="/get-offer">Request an offer <ArrowRight size={18} aria-hidden="true" /></a>
              <a className="button secondary" href={slug === "how-it-works" ? "/faq" : "/how-it-works"}>{slug === "how-it-works" ? "Read the FAQs" : "How it works"}</a>
            </div>
          </div>
          <ContactCard />
        </div>
      </section>
      <section className="section">
        <div className="container content-page">
          <div><p className="eyebrow">Before you decide</p><h2>{local?.heading ?? (slug === "privacy" ? "How your inquiry is handled" : slug === "about-red-clay-capital" ? "A property decision starts with a conversation" : slug === "contact" ? "Start with what you know" : "Understand your next step")}</h2></div>
          <div className="content-stack">
            {page.sections.map((section) => <p key={section}>{section}</p>)}
            {local && local.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            {local && <><h3>A useful first checklist</h3><ul>{local.checklist.map((item) => <li key={item}>{item}</li>)}</ul><p><a href={`/blog/${local.guide}`}>Read the related seller guide</a> or explore our <a href="/areas-we-serve/north-carolina">North Carolina guide and official resources</a>.</p></>}
            {slug === "our-buying-process" && <p><a href="/how-it-works">Read the complete step-by-step process.</a></p>}
            {slug === "faq" && <div className="faq-list">{faqs.map((faq) => <details key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}</div>}
          </div>
        </div>
      </section>
      {slug === "areas-we-serve" ? (
        <section className="section alt">
          <div className="container">
            <div className="section-heading"><p className="eyebrow">Three focus markets</p><h2>Start with your state</h2><p className="muted">Practical guidance for your property, with a direct path to a conversation.</p></div>
            <div className="resource-grid">{marketPages.map((market) => <a className="resource city-link" href={`/areas-we-serve/${market.slug}`} key={market.slug}><span>{market.abbreviation}</span><h3>{market.state}</h3><p className="muted">{market.description}</p></a>)}</div>
            <div className="section-heading"><h2>North Carolina city guides</h2><p className="muted">Existing local guides for owners comparing their sale options. We confirm fit for each property after review.</p></div>
            <div className="resource-grid">{cityPages.map((item) => <a className="resource city-link" href={item.href ?? `/areas-we-serve/${item.slug}`} key={item.slug}><span>{item.city}, North Carolina</span><h3>{cityGuidance[item.slug]?.heading ?? item.title}</h3></a>)}</div>
          </div>
        </section>
      ) : (
        <section className="section alt"><div className="container"><div className="section-heading"><h2>Take the next step at your pace</h2><p className="muted">Understand the process, compare your options, or tell us about your property.</p></div><div className="hero-actions"><a className="button" href="/get-offer">Request an offer <ArrowRight size={18} aria-hidden="true" /></a><a className="button secondary" href="/blog">Explore seller resources</a><a href="/areas-we-serve">See our focus markets</a></div></div></section>
      )}
      <SiteFooter />
    </main>
  );
}
