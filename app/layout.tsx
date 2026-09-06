import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./seller.css";
import { site } from "@/content/site";
import { SiteExperience } from "@/components/SiteExperience";
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#f0eee5" };
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "Sell Your Property As-Is in NC, GA & OH | Red Clay Capital", template: "%s | Red Clay Capital" },
  description: "Explore an as-is sale for your property in North Carolina, Georgia or Ohio. Red Clay Capital helps owners understand a potential offer, the process and their options.",
  alternates: { canonical: "/" },
  openGraph: { title: "Red Clay Capital | A simpler way to sell your property", description: "Explore your options in North Carolina, Georgia and Ohio. Start with a conversation.", url: site.url, siteName: site.name, images: [{ url: "/social-preview.png", width: 1200, height: 630, alt: "Red Clay Capital — a simpler way to sell your property" }], locale: "en_US", type: "website" },
  twitter: { card: "summary_large_image", title: "Red Clay Capital", description: "A simpler way to sell your property in NC, GA and OH.", images: ["/social-preview.png"] },
  robots: { index: true, follow: true }
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const organization = { "@context": "https://schema.org", "@type": "Organization", "@id": `${site.url}/#organization`, name: site.name, url: site.url, telephone: site.phoneE164, email: site.email, logo: `${site.url}/icon.svg`, areaServed: ["North Carolina", "Georgia", "Ohio"] };
  return <html lang="en"><body><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization).replace(/</g, "\\u003c") }} />{children}<SiteExperience gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} gtmId={process.env.NEXT_PUBLIC_GTM_ID} /></body></html>;
}

