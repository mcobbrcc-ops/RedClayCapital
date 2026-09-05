import { site } from "@/content/site";
export function SiteFooter() {
  return <footer className="site-footer"><div className="container footer-grid">
    <div><a className="brand" href="/"><span className="brand-mark" aria-hidden="true">RC</span><span className="brand-wordmark">RED CLAY<span>CAPITAL, LLC</span></span></a><p>A clearer next step for your property.<br />North Carolina · Georgia · Ohio</p><p>Red Clay Capital LLC · Michael Cobb, owner</p></div>
    <div><h2>Let’s talk about it.</h2><a className="footer-phone" href={site.phoneHref}>{site.phone}</a><p><a href={site.smsHref}>Send a text</a> · <a href={`mailto:${site.email}`}>Email us</a></p></div>
    <nav aria-label="Footer navigation"><a href="/how-it-works">How it works</a><a href="/about-red-clay-capital">About Red Clay Capital</a><a href="/areas-we-serve">Areas we serve</a><a href="/blog">Seller resources</a><a href="/faq">FAQs</a><a href="/contact">Contact</a></nav>
  </div><div className="container footer-bottom"><span>© {new Date().getFullYear()} Red Clay Capital, LLC</span><a href="/privacy">Privacy & contact choices</a><span>A request starts a conversation. Any sale requires agreed written terms.</span></div></footer>;
}
