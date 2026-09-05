"use client";
import { useRef } from "react";
import { Menu, Phone } from "lucide-react";
import { site } from "@/content/site";
const navigation = [["/how-it-works", "How it works"], ["/areas-we-serve", "Where we help"], ["/about-red-clay-capital", "About us"], ["/blog", "Seller resources"]];
export function SiteHeader({ ctaHref = "/get-offer" }: { ctaHref?: string }) {
  const menu = useRef<HTMLDetailsElement>(null);
  return <header className="site-header"><a className="skip-link" href="#main-content">Skip to content</a>
    <div className="container header-inner">
      <a className="brand" href="/"><span className="brand-mark" aria-hidden="true">RC</span><span className="brand-wordmark">RED CLAY <span>CAPITAL, LLC</span></span></a>
      <nav className="nav" aria-label="Main navigation">{navigation.map(([href, label]) => <a href={href} key={href}>{label}</a>)}</nav>
      <div className="header-contact"><a href={site.phoneHref}><Phone size={15} aria-hidden="true" />{site.phone}</a><a href={site.smsHref}>Call or text us</a></div>
      <a className="button desktop-offer" href={ctaHref}>Request an offer</a>
      <details className="mobile-menu" ref={menu} onKeyDown={event => { if (event.key === "Escape") { menu.current?.removeAttribute("open"); menu.current?.querySelector("summary")?.focus(); } }}>
        <summary aria-label="Navigation menu"><Menu size={23} aria-hidden="true" /></summary>
        <nav className="mobile-menu-panel" aria-label="Mobile navigation" onClick={() => menu.current?.removeAttribute("open")}>
          <a href="/">Home</a>{navigation.map(([href, label]) => <a href={href} key={href}>{label}</a>)}
          <a href="/faq">Common questions</a><a href="/contact">Contact</a><a href={site.phoneHref}>Call {site.phone}</a><a href={site.smsHref}>Text {site.phone}</a><a className="button" href={ctaHref}>Request an offer</a>
        </nav>
      </details>
    </div></header>;
}
