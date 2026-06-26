import type { Metadata } from "next";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { cityPages, site } from "@/content/site";

type PageProps = {
  params: Promise<{ city: string }>;
};

export function generateStaticParams() {
  return cityPages.map((page) => ({ city: page.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city } = await params;
  const page = cityPages.find((item) => item.slug === city);

  if (!page) {
    return {};
  }

  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: `/areas-we-serve/${page.slug}`
    },
    openGraph: {
      title: `${page.title} | Red Clay Capital`,
      description: page.description,
      url: `${site.url}/areas-we-serve/${page.slug}`,
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

export default async function CityPage({ params }: PageProps) {
  const { city } = await params;
  const page = cityPages.find((item) => item.slug === city);

  if (!page) {
    notFound();
  }

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: site.name,
    url: `${site.url}/areas-we-serve/${page.slug}`,
    areaServed: `${page.city}, ${page.state}`,
    email: site.email,
    telephone: site.phone,
    founder: {
      "@type": "Person",
      name: site.founder
    }
  };

  return (
    <main className="page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <SiteHeader />

      <section className="subpage-hero">
        <div className="container subpage-grid">
          <div>
            <p className="eyebrow">Cash home buyers in {page.city}</p>
            <h1>{page.title}</h1>
            <p className="hero-copy">{page.description}</p>
            <div className="hero-actions">
              <a className="button" href="/#get-my-cash-offer">
                Request a Private Review
                <ArrowRight size={18} aria-hidden="true" />
              </a>
              <a className="button secondary" href="/areas-we-serve">
                View Nearby Areas
              </a>
            </div>
          </div>
          <aside className="subpage-contact">
            <h2>{page.city} Property Situations</h2>
            <p>
              Inherited property, repairs, tenants, vacancy, title questions,
              or a fast timeline can all change the best sale path.
            </p>
          </aside>
        </div>
      </section>

      <section className="section">
        <div className="container content-page">
          <div>
            <p className="eyebrow">Local guidance</p>
            <h2>Options Before You List</h2>
          </div>
          <div className="content-stack">
            {page.localNotes.map((note) => (
              <p key={note}>{note}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <div className="feature-list light-list">
            {[
              "Sell as-is without repairs",
              "Private review with no pressure",
              "Flexible closing timeline"
            ].map((item) => (
              <div className="feature" key={item}>
                <CheckCircle2 size={20} aria-hidden="true" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
