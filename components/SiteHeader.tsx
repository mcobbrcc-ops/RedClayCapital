import { Menu } from "lucide-react";

type SiteHeaderProps = {
  ctaHref?: string;
};

const navItems = [
  { href: "/", label: "Home" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about-red-clay-capital", label: "About Us" },
  { href: "/areas-we-serve", label: "Areas We Serve" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" }
];

export function SiteHeader({ ctaHref = "/#get-my-cash-offer" }: SiteHeaderProps) {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <a className="brand" href="/" aria-label="Red Clay Capital home">
          <span className="brand-mark" aria-hidden="true">RC</span>
          <span>Red Clay Capital, LLC</span>
        </a>
        <nav className="nav" aria-label="Main navigation">
          {navItems.slice(0, 5).map((item) => (
            <a href={item.href} key={item.href}>
              {item.label}
            </a>
          ))}
          <a className="button nav-button" href={ctaHref}>
            Get My Offer
          </a>
        </nav>
        <details className="mobile-menu">
          <summary aria-label="Open navigation menu">
            <Menu size={22} aria-hidden="true" />
          </summary>
          <div className="mobile-menu-panel">
            {navItems.map((item) => (
              <a href={item.href} key={item.href}>
                {item.label}
              </a>
            ))}
            <a className="button" href={ctaHref}>
              Get My Offer
            </a>
          </div>
        </details>
      </div>
    </header>
  );
}
