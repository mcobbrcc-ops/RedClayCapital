"use client";

import { useMemo, useState } from "react";
import {
  BadgeCheck,
  CalendarCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Clock,
  FileCheck2,
  Handshake,
  Home,
  MapPin,
  MessageCircle,
  PlayCircle,
  Scale,
  Search,
  ShieldCheck,
  Star,
  UserRoundCheck,
  Video
} from "lucide-react";
import type { TestimonialRecord } from "@/lib/testimonialStore";

const trustFeatures = [
  { title: "Honest Property Evaluations", icon: FileCheck2 },
  { title: "No High-Pressure Sales", icon: ShieldCheck },
  { title: "Transparent Communication", icon: MessageCircle },
  { title: "Fair Cash Offers", icon: CircleDollarSign },
  { title: "Local Market Knowledge", icon: MapPin },
  { title: "Close On Your Timeline", icon: Clock },
  { title: "Remote Closings Available", icon: Home },
  { title: "Professional Closing Attorneys", icon: Scale }
];

const experienceSteps = [
  "Reach Out",
  "Conversation",
  "Property Review",
  "Transparent Offer",
  "Questions Answered",
  "Choose Your Timeline",
  "Closing",
  "Move Forward"
];

const credibilityBadges = [
  { title: "Professional Closings", icon: BadgeCheck },
  { title: "Attorney Assisted Closings", icon: Scale },
  { title: "Local Company", icon: MapPin },
  { title: "Transparent Process", icon: FileCheck2 },
  { title: "Remote Closing Available", icon: CalendarCheck },
  { title: "Fast Response", icon: Clock },
  { title: "No Hidden Fees", icon: Handshake }
];

function displayName(testimonial: TestimonialRecord) {
  return [testimonial.customerName, testimonial.lastInitial].filter(Boolean).join(" ");
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="stars" aria-label={`${rating} out of 5 star rating`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          size={18}
          fill={index < rating ? "currentColor" : "none"}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

function SourceBadge({ testimonial }: { testimonial: TestimonialRecord }) {
  const label = testimonial.verified ? "Verified review" : `${testimonial.source} review`;
  return (
    <span className={testimonial.verified ? "review-badge verified" : "review-badge placeholder"}>
      <BadgeCheck size={14} aria-hidden="true" />
      {label}
    </span>
  );
}

export function TestimonialCard({ testimonial, featured = false }: { testimonial: TestimonialRecord; featured?: boolean }) {
  return (
    <article className={featured ? "testimonial-card featured" : "testimonial-card"}>
      <div className="testimonial-topline">
        <span>{testimonial.situation}</span>
        <SourceBadge testimonial={testimonial} />
      </div>
      <Stars rating={testimonial.rating} />
      <blockquote>{testimonial.reviewText}</blockquote>
      <footer>
        <div className="avatar" aria-hidden="true">
          {testimonial.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={testimonial.photoUrl} alt="" />
          ) : (
            <UserRoundCheck size={22} />
          )}
        </div>
        <div>
          <strong>{displayName(testimonial)}</strong>
          <span>
            {testimonial.city}, {testimonial.state}
          </span>
        </div>
      </footer>
      {testimonial.closingDate && (
        <p className="closing-date">Closed {new Date(testimonial.closingDate).toLocaleDateString()}</p>
      )}
    </article>
  );
}

export function TestimonialCarousel({ testimonials }: { testimonials: TestimonialRecord[] }) {
  const featured = testimonials.filter((testimonial) => testimonial.featured).slice(0, 4);
  const slides = featured.length ? featured : testimonials.slice(0, 4);
  const [active, setActive] = useState(0);
  const testimonial = slides[active] || testimonials[0];

  if (!testimonial) return null;

  function go(direction: number) {
    setActive((current) => (current + direction + slides.length) % slides.length);
  }

  return (
    <section className="section testimonial-section">
      <div className="container">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Trust and reputation</p>
            <h2>Real Stories. Real Solutions.</h2>
          </div>
          <p className="muted">
            Helping homeowners through difficult situations is why we do what we do.
          </p>
        </div>

        <div className="placeholder-note">
          Placeholder testimonials for development only. These examples will be replaced with verified customer reviews after real transactions.
        </div>

        <div className="testimonial-carousel">
          <button className="carousel-control" onClick={() => go(-1)} type="button" aria-label="Previous testimonial">
            <ChevronLeft size={20} aria-hidden="true" />
          </button>
          <TestimonialCard testimonial={testimonial} featured />
          <button className="carousel-control" onClick={() => go(1)} type="button" aria-label="Next testimonial">
            <ChevronRight size={20} aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}

export function HomeownerTrustSection() {
  return (
    <section className="section alt trust-reputation">
      <div className="container">
        <div className="section-heading">
          <div>
            <p className="eyebrow">A calmer way to sell</p>
            <h2>Why Homeowners Trust Red Clay Capital</h2>
          </div>
          <p className="muted">
            We do not just buy houses. We help people move forward with clear options, patient conversations, and professional closings.
          </p>
        </div>
        <div className="trust-feature-grid">
          {trustFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <article className="trust-feature" key={feature.title}>
                <Icon size={22} aria-hidden="true" />
                <h3>{feature.title}</h3>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function CustomerExperienceTimeline() {
  return (
    <section className="section experience-section">
      <div className="container">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Homeowner control</p>
            <h2>A Process That Keeps You In Charge</h2>
          </div>
          <p className="muted">
            Each step is designed to answer questions before decisions are needed. You choose whether the offer and timeline fit.
          </p>
        </div>
        <div className="experience-timeline">
          {experienceSteps.map((step, index) => (
            <div className="experience-step" key={step}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{step}</strong>
              {index < experienceSteps.length - 1 && <i aria-hidden="true" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CredibilityBadges() {
  return (
    <section className="section dark credibility-section">
      <div className="container">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Professional standards</p>
            <h2>Built For Confidence From First Call To Closing</h2>
          </div>
          <p className="muted">
            The right buyer should make the process clearer, not louder. These are the standards Red Clay Capital is built around.
          </p>
        </div>
        <div className="credibility-grid">
          {credibilityBadges.map((badge) => {
            const Icon = badge.icon;
            return (
              <div className="credibility-badge" key={badge.title}>
                <Icon size={21} aria-hidden="true" />
                <span>{badge.title}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function ReviewsExplorer({ testimonials }: { testimonials: TestimonialRecord[] }) {
  const [search, setSearch] = useState("");
  const [situation, setSituation] = useState("");
  const [city, setCity] = useState("");

  const situations = useMemo(
    () => Array.from(new Set(testimonials.map((testimonial) => testimonial.situation))).sort(),
    [testimonials]
  );
  const cities = useMemo(
    () => Array.from(new Set(testimonials.map((testimonial) => testimonial.city))).sort(),
    [testimonials]
  );
  const filtered = testimonials.filter((testimonial) => {
    const haystack = [
      testimonial.customerName,
      testimonial.lastInitial,
      testimonial.city,
      testimonial.state,
      testimonial.situation,
      testimonial.reviewText,
      testimonial.storyHighlight
    ]
      .join(" ")
      .toLowerCase();
    return (
      (!search || haystack.includes(search.toLowerCase())) &&
      (!situation || testimonial.situation === situation) &&
      (!city || testimonial.city === city)
    );
  });
  const verifiedCount = testimonials.filter((testimonial) => testimonial.verified).length;
  const averageRating =
    testimonials.reduce((total, testimonial) => total + testimonial.rating, 0) / Math.max(testimonials.length, 1);
  const featured = filtered.filter((testimonial) => testimonial.featured);

  return (
    <>
      <section className="section reviews-summary">
        <div className="container">
          <div className="review-metrics">
            <div>
              <span>{averageRating.toFixed(1)}</span>
              <strong>Average Rating</strong>
              <p>Placeholder rating until verified reviews are added.</p>
            </div>
            <div>
              <span>{verifiedCount}</span>
              <strong>Verified Reviews</strong>
              <p>Verified customer reviews will appear here after real transactions.</p>
            </div>
            <div>
              <span>{testimonials.length}</span>
              <strong>Review Records</strong>
              <p>Includes clearly labeled placeholder examples for development.</p>
            </div>
          </div>

          <div className="reviews-filter-bar">
            <label>
              <Search size={17} aria-hidden="true" />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search reviews" />
            </label>
            <select value={situation} onChange={(event) => setSituation(event.target.value)} aria-label="Filter by situation">
              <option value="">All situations</option>
              {situations.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            <select value={city} onChange={(event) => setCity(event.target.value)} aria-label="Filter by city">
              <option value="">All cities</option>
              {cities.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Featured experiences</p>
              <h2>Stories That Show The Standard</h2>
            </div>
            <p className="muted">
              These placeholder examples demonstrate the type of respectful, transparent experience Red Clay Capital is designed to deliver.
            </p>
          </div>
          <div className="testimonial-grid">
            {(featured.length ? featured : filtered.slice(0, 3)).map((testimonial) => (
              <TestimonialCard testimonial={testimonial} key={testimonial.id} />
            ))}
          </div>
        </div>
      </section>

      <section className="section video-review-section">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Video testimonials</p>
              <h2>Future Customer Video Stories</h2>
            </div>
            <p className="muted">
              Video placeholders are reserved for verified customer stories. No video testimonial is shown as real until approved.
            </p>
          </div>
          <div className="video-placeholder-grid">
            {filtered.filter((testimonial) => testimonial.videoPlaceholder).slice(0, 2).map((testimonial) => (
              <article className="video-placeholder" key={testimonial.id}>
                <Video size={26} aria-hidden="true" />
                <PlayCircle size={42} aria-hidden="true" />
                <h3>{testimonial.situation} Story</h3>
                <p>{testimonial.city}, {testimonial.state} placeholder video slot</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Written testimonials</p>
              <h2>Searchable Review Library</h2>
            </div>
            <p className="muted">Filter by situation or city to prepare for a verified review library.</p>
          </div>
          <div className="testimonial-grid">
            {filtered.map((testimonial) => (
              <TestimonialCard testimonial={testimonial} key={testimonial.id} />
            ))}
            {!filtered.length && <p>No reviews match the current filters.</p>}
          </div>
        </div>
      </section>

      <section className="section closing-highlights">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Closing story highlights</p>
              <h2>Different Situations. The Same Calm Standard.</h2>
            </div>
            <p className="muted">
              Future verified reviews can include short closing summaries that help homeowners see what a respectful process looks like.
            </p>
          </div>
          <div className="highlight-grid">
            {filtered.slice(0, 6).map((testimonial) => (
              <article className="story-highlight" key={`${testimonial.id}-highlight`}>
                <CheckCircle2 size={18} aria-hidden="true" />
                <h3>{testimonial.situation}</h3>
                <p>{testimonial.storyHighlight || testimonial.reviewText}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
