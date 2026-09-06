import type { ReactNode } from "react";
import { ArrowRight, Mail, MessageSquare, Phone } from "lucide-react";
import { site } from "@/content/site";

export function ContactCard({ title = "Prefer to talk?", children, offerLink = false, as: Tag = "aside" }: { title?: string; children?: ReactNode; offerLink?: boolean; as?: "aside" | "div" }) {
  return <Tag className="subpage-contact contact-card" data-cta-placement="contact_card">
    <Phone size={26} aria-hidden="true" />
    <h2>{title}</h2>
    <p>{children ?? "Share the property location and what you are considering. A conversation is a starting point; there is no obligation to accept an offer."}</p>
    <p className="contact-card-number">{site.phone}</p>
    <div className="contact-card-actions">
      <a className="button" href={site.phoneHref} aria-label={`Call ${site.phone}`}><Phone size={20} aria-hidden="true" />Call</a>
      <a className="button secondary" href={site.smsHref} aria-label={`Text ${site.phone}`}><MessageSquare size={20} aria-hidden="true" />Text</a>
    </div>
    <a className="contact-card-email" href={`mailto:${site.email}`}><Mail size={19} aria-hidden="true" /><span>{site.email}</span></a>
    {offerLink && <a className="contact-card-offer" href="/get-offer">Request an offer<ArrowRight size={17} aria-hidden="true" /></a>}
  </Tag>;
}
