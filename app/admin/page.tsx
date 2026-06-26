"use client";

import { FormEvent, useMemo, useState } from "react";
import { Download, LockKeyhole, Search } from "lucide-react";

type Lead = {
  id: string;
  submittedAt: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  propertyCondition: string;
  timeline: string;
  details: string;
  sourcePage: string;
  utmParams: Record<string, string>;
  status: string;
};

type Testimonial = {
  id: string;
  customerName: string;
  lastInitial?: string;
  city: string;
  state: string;
  situation: string;
  rating: number;
  reviewText: string;
  photoUrl?: string;
  verified: boolean;
  closingDate?: string;
  featured: boolean;
  source: "Seller Feedback" | "Internal" | "Google" | "Facebook" | "Zillow";
  status: "Pending" | "Approved" | "Hidden";
  storyHighlight?: string;
  tags?: string[];
};

const leadStatuses = ["New", "Contacted", "Offer Made", "Follow Up", "Closed", "Archived"];
const testimonialStatuses = ["Pending", "Approved", "Hidden"];
const reviewSources = ["Seller Feedback", "Internal", "Google", "Facebook", "Zillow"];

const emptyTestimonial: Partial<Testimonial> = {
  customerName: "",
  lastInitial: "",
  city: "",
  state: "NC",
  situation: "",
  rating: 5,
  reviewText: "",
  photoUrl: "",
  verified: false,
  closingDate: "",
  featured: false,
  source: "Internal",
  status: "Pending",
  storyHighlight: "",
  tags: []
};

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [activeTab, setActiveTab] = useState<"leads" | "testimonials">("leads");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Partial<Testimonial>>(emptyTestimonial);
  const [search, setSearch] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [testimonialSearch, setTestimonialSearch] = useState("");
  const [testimonialTags, setTestimonialTags] = useState("");
  const [message, setMessage] = useState("");

  const leadQuery = useMemo(() => {
    const params = new URLSearchParams({ password });
    if (search) params.set("search", search);
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    return params.toString();
  }, [from, password, search, to]);

  const testimonialQuery = useMemo(() => {
    const params = new URLSearchParams({ password });
    if (testimonialSearch) params.set("search", testimonialSearch);
    return params.toString();
  }, [password, testimonialSearch]);

  async function loadLeads() {
    const response = await fetch(`/api/admin/leads?${leadQuery}`);

    if (!response.ok) {
      setMessage("Incorrect password or unable to load leads.");
      setAuthed(false);
      return false;
    }

    const data = (await response.json()) as { leads: Lead[] };
    setLeads(data.leads);
    setMessage("");
    return true;
  }

  async function loadTestimonials() {
    const response = await fetch(`/api/admin/testimonials?${testimonialQuery}`);

    if (!response.ok) {
      setMessage("Incorrect password or unable to load testimonials.");
      setAuthed(false);
      return false;
    }

    const data = (await response.json()) as { testimonials: Testimonial[] };
    setTestimonials(data.testimonials);
    setMessage("");
    return true;
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const loadedLeads = await loadLeads();
    const loadedTestimonials = await loadTestimonials();
    setAuthed(loadedLeads && loadedTestimonials);
  }

  async function updateLeadStatus(id: string, status: string) {
    const response = await fetch("/api/admin/leads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, id, status })
    });

    if (response.ok) {
      await loadLeads();
      setSelectedLead((lead) => (lead && lead.id === id ? { ...lead, status } : lead));
    }
  }

  async function saveTestimonial(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const method = selectedTestimonial.id ? "PATCH" : "POST";
    const response = await fetch("/api/admin/testimonials", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...selectedTestimonial, password })
    });

    if (!response.ok) {
      const data = await response.json();
      setMessage(data.error || "Unable to save testimonial.");
      return;
    }

    setMessage("Testimonial saved.");
    setSelectedTestimonial(emptyTestimonial);
    setTestimonialTags("");
    await loadTestimonials();
  }

  async function quickUpdateTestimonial(id: string, changes: Partial<Testimonial>) {
    const response = await fetch("/api/admin/testimonials", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, id, ...changes })
    });

    if (response.ok) {
      await loadTestimonials();
    }
  }

  function exportCsv() {
    window.location.href = `/api/admin/leads?${leadQuery}&format=csv`;
  }

  return (
    <main className="admin-page">
      <section className="admin-shell">
        <div className="admin-header">
          <div>
            <p className="eyebrow">Red Clay Capital</p>
            <h1>Admin Dashboard</h1>
          </div>
          <a href="/">Back to site</a>
        </div>

        {!authed ? (
          <form className="admin-card admin-login" onSubmit={handleLogin}>
            <LockKeyhole size={24} aria-hidden="true" />
            <h2>Enter Admin Password</h2>
            <label htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
            />
            <button className="button" type="submit">Open Dashboard</button>
            {message && <p className="admin-message">{message}</p>}
          </form>
        ) : (
          <>
            <div className="admin-tabs" role="tablist" aria-label="Admin sections">
              <button
                className={activeTab === "leads" ? "active" : ""}
                onClick={() => setActiveTab("leads")}
                type="button"
              >
                Leads
              </button>
              <button
                className={activeTab === "testimonials" ? "active" : ""}
                onClick={() => setActiveTab("testimonials")}
                type="button"
              >
                Testimonials
              </button>
            </div>

            {activeTab === "leads" ? (
              <>
                <div className="admin-toolbar">
                  <label>
                    <Search size={16} aria-hidden="true" />
                    <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search leads" />
                  </label>
                  <input type="date" value={from} onChange={(event) => setFrom(event.target.value)} />
                  <input type="date" value={to} onChange={(event) => setTo(event.target.value)} />
                  <button className="button secondary" onClick={loadLeads} type="button">Apply</button>
                  <button className="button" onClick={exportCsv} type="button">
                    <Download size={16} aria-hidden="true" />
                    Export CSV
                  </button>
                </div>

                <div className="admin-grid">
                  <div className="admin-card admin-table-wrap">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Name</th>
                          <th>Phone</th>
                          <th>Address</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leads.map((lead) => (
                          <tr key={lead.id} onClick={() => setSelectedLead(lead)}>
                            <td>{new Date(lead.submittedAt).toLocaleString()}</td>
                            <td>{lead.name}</td>
                            <td>{lead.phone}</td>
                            <td>{lead.address}</td>
                            <td>
                              <select
                                value={lead.status}
                                onClick={(event) => event.stopPropagation()}
                                onChange={(event) => updateLeadStatus(lead.id, event.target.value)}
                              >
                                {leadStatuses.map((status) => (
                                  <option key={status}>{status}</option>
                                ))}
                              </select>
                            </td>
                          </tr>
                        ))}
                        {!leads.length && (
                          <tr>
                            <td colSpan={5}>No leads found.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  <aside className="admin-card lead-detail">
                    <h2>Lead Details</h2>
                    {selectedLead ? (
                      <dl>
                        <dt>Status</dt>
                        <dd>{selectedLead.status}</dd>
                        <dt>Submitted</dt>
                        <dd>{new Date(selectedLead.submittedAt).toLocaleString()}</dd>
                        <dt>Name</dt>
                        <dd>{selectedLead.name}</dd>
                        <dt>Phone</dt>
                        <dd>{selectedLead.phone}</dd>
                        <dt>Email</dt>
                        <dd>{selectedLead.email || "-"}</dd>
                        <dt>Property address</dt>
                        <dd>{selectedLead.address}</dd>
                        <dt>Condition</dt>
                        <dd>{selectedLead.propertyCondition || "-"}</dd>
                        <dt>Timeline</dt>
                        <dd>{selectedLead.timeline || "-"}</dd>
                        <dt>Source page</dt>
                        <dd>{selectedLead.sourcePage}</dd>
                        <dt>UTM parameters</dt>
                        <dd>{Object.keys(selectedLead.utmParams || {}).length ? JSON.stringify(selectedLead.utmParams) : "-"}</dd>
                        <dt>Message</dt>
                        <dd>{selectedLead.details || "-"}</dd>
                      </dl>
                    ) : (
                      <p>Select a lead to view details.</p>
                    )}
                  </aside>
                </div>
              </>
            ) : (
              <div className="admin-testimonials">
                <div className="admin-toolbar">
                  <label>
                    <Search size={16} aria-hidden="true" />
                    <input
                      value={testimonialSearch}
                      onChange={(event) => setTestimonialSearch(event.target.value)}
                      placeholder="Search testimonials"
                    />
                  </label>
                  <button className="button secondary" onClick={loadTestimonials} type="button">Apply</button>
                  <button className="button secondary" type="button" disabled>
                    Import Google Reviews
                  </button>
                </div>

                <div className="admin-testimonial-grid">
                  <form className="admin-card testimonial-form" onSubmit={saveTestimonial}>
                    <h2>{selectedTestimonial.id ? "Edit Review" : "Add Review"}</h2>
                    <div className="admin-form-grid">
                      <label>
                        Customer name
                        <input
                          value={selectedTestimonial.customerName || ""}
                          onChange={(event) => setSelectedTestimonial((item) => ({ ...item, customerName: event.target.value }))}
                        />
                      </label>
                      <label>
                        Last initial
                        <input
                          value={selectedTestimonial.lastInitial || ""}
                          onChange={(event) => setSelectedTestimonial((item) => ({ ...item, lastInitial: event.target.value }))}
                        />
                      </label>
                      <label>
                        City
                        <input
                          value={selectedTestimonial.city || ""}
                          onChange={(event) => setSelectedTestimonial((item) => ({ ...item, city: event.target.value }))}
                        />
                      </label>
                      <label>
                        State
                        <input
                          value={selectedTestimonial.state || ""}
                          onChange={(event) => setSelectedTestimonial((item) => ({ ...item, state: event.target.value }))}
                        />
                      </label>
                      <label>
                        Situation
                        <input
                          value={selectedTestimonial.situation || ""}
                          onChange={(event) => setSelectedTestimonial((item) => ({ ...item, situation: event.target.value }))}
                        />
                      </label>
                      <label>
                        Rating
                        <input
                          min="1"
                          max="5"
                          type="number"
                          value={selectedTestimonial.rating || 5}
                          onChange={(event) => setSelectedTestimonial((item) => ({ ...item, rating: Number(event.target.value) }))}
                        />
                      </label>
                      <label>
                        Closing date
                        <input
                          type="date"
                          value={selectedTestimonial.closingDate || ""}
                          onChange={(event) => setSelectedTestimonial((item) => ({ ...item, closingDate: event.target.value }))}
                        />
                      </label>
                      <label>
                        Photo URL
                        <input
                          value={selectedTestimonial.photoUrl || ""}
                          onChange={(event) => setSelectedTestimonial((item) => ({ ...item, photoUrl: event.target.value }))}
                        />
                      </label>
                      <label>
                        Source
                        <select
                          value={selectedTestimonial.source || "Internal"}
                          onChange={(event) => setSelectedTestimonial((item) => ({ ...item, source: event.target.value as Testimonial["source"] }))}
                        >
                          {reviewSources.map((source) => (
                            <option key={source}>{source}</option>
                          ))}
                        </select>
                      </label>
                      <label>
                        Status
                        <select
                          value={selectedTestimonial.status || "Pending"}
                          onChange={(event) => setSelectedTestimonial((item) => ({ ...item, status: event.target.value as Testimonial["status"] }))}
                        >
                          {testimonialStatuses.map((status) => (
                            <option key={status}>{status}</option>
                          ))}
                        </select>
                      </label>
                    </div>
                    <label>
                      Review text
                      <textarea
                        value={selectedTestimonial.reviewText || ""}
                        onChange={(event) => setSelectedTestimonial((item) => ({ ...item, reviewText: event.target.value }))}
                      />
                    </label>
                    <label>
                      Tags
                      <input
                        value={testimonialTags || (selectedTestimonial.tags || []).join(", ")}
                        onChange={(event) => {
                          setTestimonialTags(event.target.value);
                          setSelectedTestimonial((item) => ({
                            ...item,
                            tags: event.target.value.split(",").map((tag) => tag.trim()).filter(Boolean)
                          }));
                        }}
                        placeholder="Transparency, Fair Offer, Fast Closing"
                      />
                    </label>
                    <label>
                      Closing story highlight
                      <textarea
                        value={selectedTestimonial.storyHighlight || ""}
                        onChange={(event) => setSelectedTestimonial((item) => ({ ...item, storyHighlight: event.target.value }))}
                      />
                    </label>
                    <div className="admin-checkboxes">
                      <label>
                        <input
                          type="checkbox"
                          checked={Boolean(selectedTestimonial.verified)}
                          onChange={(event) => setSelectedTestimonial((item) => ({ ...item, verified: event.target.checked }))}
                        />
                        Verified
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          checked={Boolean(selectedTestimonial.featured)}
                          onChange={(event) => setSelectedTestimonial((item) => ({ ...item, featured: event.target.checked }))}
                        />
                        Featured
                      </label>
                    </div>
                    <div className="admin-form-actions">
                      <button className="button" type="submit">Save Review</button>
                      <button className="button secondary" onClick={() => {
                        setSelectedTestimonial(emptyTestimonial);
                        setTestimonialTags("");
                      }} type="button">
                        New Blank Review
                      </button>
                    </div>
                    {message && <p className="admin-message">{message}</p>}
                  </form>

                  <div className="admin-card admin-table-wrap">
                    <table className="admin-table testimonial-admin-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>City</th>
                          <th>Situation</th>
                          <th>Status</th>
                          <th>Flags</th>
                        </tr>
                      </thead>
                      <tbody>
                        {testimonials.map((testimonial) => (
                          <tr key={testimonial.id} onClick={() => {
                            setSelectedTestimonial(testimonial);
                            setTestimonialTags((testimonial.tags || []).join(", "));
                          }}>
                            <td>{testimonial.customerName} {testimonial.lastInitial}</td>
                            <td>{testimonial.city}, {testimonial.state}</td>
                            <td>{testimonial.situation}</td>
                            <td>
                              <select
                                value={testimonial.status}
                                onClick={(event) => event.stopPropagation()}
                                onChange={(event) => quickUpdateTestimonial(testimonial.id, { status: event.target.value as Testimonial["status"] })}
                              >
                                {testimonialStatuses.map((status) => (
                                  <option key={status}>{status}</option>
                                ))}
                              </select>
                            </td>
                            <td>
                              <button
                                className={testimonial.featured ? "flag-button active" : "flag-button"}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  quickUpdateTestimonial(testimonial.id, { featured: !testimonial.featured });
                                }}
                                type="button"
                              >
                                Featured
                              </button>
                              <button
                                className={testimonial.verified ? "flag-button active" : "flag-button"}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  quickUpdateTestimonial(testimonial.id, { verified: !testimonial.verified });
                                }}
                                type="button"
                              >
                                Verified
                              </button>
                            </td>
                          </tr>
                        ))}
                        {!testimonials.length && (
                          <tr>
                            <td colSpan={5}>No testimonials found.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
