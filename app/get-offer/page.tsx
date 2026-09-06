import type { Metadata } from "next";
import { LeadForm } from "@/components/LeadForm";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { site } from "@/content/site";
export const metadata: Metadata = { title: "Request an Offer for Your Property", description: "Tell Red Clay Capital about your property in North Carolina, Georgia, or Ohio. Request a conversation about a potential as-is offer, with no obligation to sell.", alternates: { canonical: "/get-offer" }, openGraph: { images: [{ url: site.ogImage, width: 1200, height: 630, alt: "Red Clay Capital" }], title: "Request an offer | Red Clay Capital", url: `${site.url}/get-offer`, description: "Your property. Your questions. A clear next step." } };
export default function GetOffer() {
  return <main className="page"><SiteHeader ctaHref="#get-my-cash-offer" /><section className="section offer-page" id="main-content" tabIndex={-1}><div className="container offer-grid"><div><p className="eyebrow">NORTH CAROLINA · GEORGIA · OHIO</p><h1>Let’s find your<br /><em>next step.</em></h1><p className="hero-copy">Tell us about the property you’re thinking of selling. We’ll discuss your situation and whether a potential as-is offer makes sense.</p><ul className="offer-benefits"><li>Start with the property in its current condition.</li><li>Choose how you’d like us to reach you.</li><li>Review your options before making a commitment.</li></ul><p>Prefer to talk? <a className="text-link" href={site.phoneHref}>Call {site.phone}</a> or <a className="text-link" href={site.smsHref}>send a text</a>.</p><div className="offer-company"><strong>Red Clay Capital LLC</strong><span>Residential real estate acquisitions</span><a href="/about-red-clay-capital">About the company →</a></div></div><LeadForm /></div></section><SiteFooter /></main>;
}

