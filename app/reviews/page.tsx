import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
export const metadata: Metadata = { title: "Seller Confidence & Due Diligence", description: "Questions to ask when evaluating Red Clay Capital and a potential property offer.", alternates: { canonical: "/reviews" }, robots: { index: false, follow: true } };
export default function Reviews() {
  return <main className="page"><SiteHeader /><section className="section" id="main-content" tabIndex={-1}><div className="container article-body"><p className="eyebrow">CONFIDENCE COMES FROM CLARITY</p><h1>Know who you’re working with.</h1><p>Before choosing a buyer, ask about the person or company purchasing the property, how the offer was evaluated, any assignment rights, and the costs and conditions in the agreement.</p><h2>Start with a conversation.</h2><p>Red Clay Capital LLC is owned by Michael Cobb. Talk with us about your property and ask the questions that matter to your decision.</p><p><a className="text-link" href="/about-red-clay-capital">About Red Clay Capital</a> · <a className="text-link" href="/how-it-works">Understand the process</a></p><a className="button" href="/get-offer">Request an offer</a></div></section><SiteFooter /></main>;
}
