import { ArrowRight } from "lucide-react";
import { site } from "@/content/site";
export function Hero() {
  return <section className="seller-hero" id="main-content" tabIndex={-1}><div className="container seller-hero-grid">
    <div className="seller-hero-copy"><p className="eyebrow">RESIDENTIAL REAL ESTATE ACQUISITIONS</p><h1>A simpler way<br />to sell your<br /><em>property.</em></h1>
      <p className="hero-copy">Repairs, an inherited home, or a rental you’re ready to move on from. Let’s explore an as-is sale that fits your situation.</p>
      <p className="coverage-line">North Carolina <span>·</span> Georgia <span>·</span> Ohio</p>
      <a className="button" href="/get-offer">Request an offer <ArrowRight size={18} aria-hidden="true" /></a>
      <p className="hero-contact">Prefer to talk? <a href={site.phoneHref}>Call</a> or <a href={site.smsHref}>text {site.phone}</a>.</p>
    </div>
    <aside className="company-market-panel" aria-label="Our markets"><p className="eyebrow">RED CLAY CAPITAL</p><h2>Local considerations.<br /><em>A consistent process.</em></h2><p>Property-specific review. Clear proposed terms. A decision that stays yours.</p><nav aria-label="Explore seller information by state">{[["NC", "North Carolina", "north-carolina"], ["GA", "Georgia", "georgia"], ["OH", "Ohio", "ohio"]].map(([code, name, slug]) => <a href={`/areas-we-serve/${slug}`} key={code}><span className="market-code">{code}</span><span>{name}</span><ArrowRight size={20} aria-hidden="true" /></a>)}</nav><a className="company-process-link" href="/how-it-works">Explore our approach <ArrowRight size={16} aria-hidden="true" /></a></aside>
  </div><div className="container seller-principles"><span>Start with your property as it is</span><span>Understand the numbers and tradeoffs</span><span>Decide when you’re ready</span></div></section>;
}
