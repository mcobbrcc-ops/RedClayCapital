import { LockKeyhole } from "lucide-react";
import { site } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <div className="brand">
            <span className="brand-mark" aria-hidden="true">RC</span>
            <span>Red Clay Capital, LLC</span>
          </div>
          <p>
            Private, as-is cash offer options for homeowners facing difficult
            property situations.
          </p>
          <p>Founder: {site.founder}</p>
          <a className="admin-link" href="/admin" aria-label="Admin dashboard">
            <LockKeyhole size={13} aria-hidden="true" />
            Admin
          </a>
        </div>
        <div>
          <p><a href="tel:+18886263213">{site.phone}</a></p>
          <p><a href={`mailto:${site.email}`}>{site.email}</a></p>
        </div>
      </div>
    </footer>
  );
}
