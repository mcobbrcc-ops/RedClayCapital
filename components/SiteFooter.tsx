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
          <div className="footer-trust-line">
            Private Acquisitions. Clear Terms. Professional Closings.
          </div>
          <p>
            As-is acquisition options for North Carolina owners facing repairs,
            tenants, financing, title issues, fire damage, vacancy, inheritance,
            or other property distress.
          </p>
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
