import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { site } from "@/content/site";
export function Hero() {
  return <section className="seller-hero" id="main-content" tabIndex={-1}><div className="container seller-hero-grid">
    <div className="seller-hero-copy"><p className="eyebrow">PROPERTY CHALLENGES. REAL CONVERSATIONS.</p><h1>A simpler way<br />to sell your<br /><em>property.</em></h1>
      <p className="hero-copy">Repairs, an inherited home, or a rental you’re ready to move on from. Let’s explore an as-is sale that fits your situation.</p>
      <p className="coverage-line">North Carolina <span>·</span> Georgia <span>·</span> Ohio</p>
      <a className="button" href="/get-offer">Request an offer <ArrowRight size={18} aria-hidden="true" /></a>
      <p className="hero-contact">Prefer to talk? <a href={site.phoneHref}>Call</a> or <a href={site.smsHref}>text {site.phone}</a>.</p>
    </div>
    <figure className="owner-portrait"><Image src="/images/red-clay-capital-founder.png" width={1254} height={1254} sizes="(max-width: 760px) 90vw, 42vw" preload alt="Michael Cobb, owner of Red Clay Capital" /><figcaption><span>A person behind the process.</span><strong>Michael Cobb</strong><span>Owner, Red Clay Capital LLC</span></figcaption></figure>
  </div><div className="container seller-principles"><span>Start with your property as it is</span><span>Understand the numbers and tradeoffs</span><span>Decide when you’re ready</span></div></section>;
}
