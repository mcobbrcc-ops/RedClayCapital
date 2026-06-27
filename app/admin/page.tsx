"use client";

import { DragEvent, FormEvent, useEffect, useMemo, useState } from "react";
import {
  Archive,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  LayoutDashboard,
  LockKeyhole,
  Mail,
  MessageSquare,
  Phone,
  Search,
  Settings,
  Star,
  Table2,
  Target,
  UserCheck
} from "lucide-react";

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
  status: LeadStatus;
};

type LeadStatus =
  | "New"
  | "Contacted"
  | "Property Review"
  | "Offer Sent"
  | "Negotiating"
  | "Under Contract"
  | "Title Work"
  | "Closing Scheduled"
  | "Closed"
  | "Archived";

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

const pipelineStages: LeadStatus[] = [
  "New",
  "Contacted",
  "Property Review",
  "Offer Sent",
  "Negotiating",
  "Under Contract",
  "Title Work",
  "Closing Scheduled",
  "Closed"
];
const testimonialStatuses = ["Pending", "Approved", "Hidden"];
const reviewSources = ["Seller Feedback", "Internal", "Google", "Facebook", "Zillow"];
const tabs = ["Overview", "Pipeline", "Leads", "Analytics", "Calendar", "Notifications", "Settings", "Testimonials"] as const;
type AdminTab = (typeof tabs)[number];

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

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function daysAgo(value: string) {
  const diff = Date.now() - new Date(value).getTime();
  return Math.max(0, Math.floor(diff / 86400000));
}

function getCity(address: string) {
  const parts = address.split(",").map((part) => part.trim()).filter(Boolean);
  return parts.length > 1 ? parts[parts.length - 2] : "Unknown";
}

function getPriority(lead: Lead) {
  const text = `${lead.timeline} ${lead.propertyCondition} ${lead.details}`.toLowerCase();
  if (text.includes("as soon") || text.includes("foreclosure") || text.includes("urgent")) return "High";
  if (text.includes("30 days") || text.includes("major") || text.includes("tenant")) return "Medium";
  return "Normal";
}

function estimatedValue(lead: Lead) {
  const seed = Array.from(lead.id).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return 125000 + (seed % 375) * 1000;
}

function nextTask(lead: Lead) {
  if (lead.status === "New") return "Call seller";
  if (lead.status === "Contacted") return "Complete property review";
  if (lead.status === "Property Review") return "Prepare offer";
  if (lead.status === "Offer Sent") return "Follow up on offer";
  if (lead.status === "Negotiating") return "Resolve seller questions";
  if (lead.status === "Under Contract") return "Send to attorney";
  if (lead.status === "Title Work") return "Confirm title status";
  if (lead.status === "Closing Scheduled") return "Confirm funding";
  if (lead.status === "Closed") return "Archive file";
  return "No active task";
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>("Overview");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Partial<Testimonial>>(emptyTestimonial);
  const [testimonialTags, setTestimonialTags] = useState("");
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("All");
  const [sortKey, setSortKey] = useState<"submittedAt" | "name" | "status" | "value">("submittedAt");
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState("");

  const leadQuery = useMemo(() => {
    const params = new URLSearchParams({ password });
    if (search) params.set("search", search);
    return params.toString();
  }, [password, search]);

  async function loadLeads({ keepAuth = true } = {}) {
    const response = await fetch(`/api/admin/leads?${leadQuery}`, { cache: "no-store" });

    if (!response.ok) {
      setMessage("Incorrect password or unable to load leads.");
      if (!keepAuth) setAuthed(false);
      return false;
    }

    const data = (await response.json()) as { leads: Lead[] };
    setLeads(data.leads);
    setMessage("");
    return true;
  }

  async function loadTestimonials({ keepAuth = true } = {}) {
    const params = new URLSearchParams({ password });
    const response = await fetch(`/api/admin/testimonials?${params.toString()}`, { cache: "no-store" });

    if (!response.ok) {
      if (!keepAuth) setAuthed(false);
      return false;
    }

    const data = (await response.json()) as { testimonials: Testimonial[] };
    setTestimonials(data.testimonials);
    return true;
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const loadedLeads = await loadLeads({ keepAuth: false });
    const loadedTestimonials = await loadTestimonials({ keepAuth: false });
    setAuthed(loadedLeads && loadedTestimonials);
  }

  useEffect(() => {
    if (!authed) return;
    const timer = window.setInterval(() => {
      loadLeads();
      loadTestimonials();
    }, 30000);
    return () => window.clearInterval(timer);
  }, [authed, leadQuery]);

  async function updateLeadStatus(id: string, status: LeadStatus) {
    const previous = leads;
    setLeads((items) => items.map((lead) => (lead.id === id ? { ...lead, status } : lead)));
    setSelectedLead((lead) => (lead && lead.id === id ? { ...lead, status } : lead));

    const response = await fetch("/api/admin/leads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, id, status })
    });

    if (!response.ok) {
      setLeads(previous);
      setMessage("Status update failed. Lead was restored.");
      return;
    }

    await loadLeads();
  }

  function onDrop(event: DragEvent<HTMLDivElement>, status: LeadStatus) {
    event.preventDefault();
    const id = event.dataTransfer.getData("text/plain");
    if (id) updateLeadStatus(id, status);
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

    if (response.ok) await loadTestimonials();
  }

  function exportCsv() {
    window.location.href = `/api/admin/leads?${leadQuery}&format=csv`;
  }

  const filteredLeads = useMemo(() => {
    const query = search.toLowerCase();
    return leads
      .filter((lead) => stageFilter === "All" || lead.status === stageFilter)
      .filter((lead) =>
        [lead.name, lead.address, lead.phone, lead.email, lead.details, lead.propertyCondition, lead.timeline]
          .join(" ")
          .toLowerCase()
          .includes(query)
      )
      .sort((a, b) => {
        if (sortKey === "name") return a.name.localeCompare(b.name);
        if (sortKey === "status") return a.status.localeCompare(b.status);
        if (sortKey === "value") return estimatedValue(b) - estimatedValue(a);
        return b.submittedAt.localeCompare(a.submittedAt);
      });
  }, [leads, search, sortKey, stageFilter]);

  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / pageSize));
  const pagedLeads = filteredLeads.slice((page - 1) * pageSize, page * pageSize);
  const today = new Date().toISOString().slice(0, 10);
  const weekAgo = Date.now() - 7 * 86400000;
  const activeLeads = leads.filter((lead) => !["Closed", "Archived"].includes(lead.status));
  const pipelineValue = activeLeads.reduce((sum, lead) => sum + estimatedValue(lead), 0);
  const closedLeads = leads.filter((lead) => lead.status === "Closed");
  const offersSent = leads.filter((lead) => ["Offer Sent", "Negotiating", "Under Contract", "Title Work", "Closing Scheduled", "Closed"].includes(lead.status));
  const kpis = [
    { label: "New Leads Today", value: leads.filter((lead) => lead.submittedAt.startsWith(today)).length, tab: "Leads" as AdminTab },
    { label: "New Leads This Week", value: leads.filter((lead) => new Date(lead.submittedAt).getTime() >= weekAgo).length, tab: "Leads" as AdminTab },
    { label: "Active Negotiations", value: leads.filter((lead) => lead.status === "Negotiating").length, tab: "Pipeline" as AdminTab },
    { label: "Offers Sent", value: offersSent.length, tab: "Pipeline" as AdminTab },
    { label: "Under Contract", value: leads.filter((lead) => lead.status === "Under Contract").length, tab: "Pipeline" as AdminTab },
    { label: "Closings This Month", value: closedLeads.length, tab: "Calendar" as AdminTab },
    { label: "Projected Pipeline Value", value: `$${Math.round(pipelineValue / 1000)}k`, tab: "Analytics" as AdminTab },
    { label: "Conversion Rate", value: `${leads.length ? Math.round((closedLeads.length / leads.length) * 100) : 0}%`, tab: "Analytics" as AdminTab },
    { label: "Average Response Time", value: "30m target", tab: "Notifications" as AdminTab },
    { label: "Average Days to Close", value: leads.length ? `${Math.max(7, Math.round(leads.reduce((sum, lead) => sum + daysAgo(lead.submittedAt), 0) / leads.length))}d` : "0d", tab: "Analytics" as AdminTab }
  ];
  const activity = leads.flatMap((lead) => [
    { id: `${lead.id}-new`, date: lead.submittedAt, text: `New lead submitted by ${lead.name}`, detail: lead.address },
    { id: `${lead.id}-status`, date: lead.submittedAt, text: `Status set to ${lead.status}`, detail: nextTask(lead) }
  ]).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 12);
  const overdue = leads.filter((lead) => lead.status === "New" && daysAgo(lead.submittedAt) >= 1);

  return (
    <main className="admin-command-page">
      {!authed ? (
        <section className="admin-auth-shell">
          <form className="admin-command-login" onSubmit={handleLogin}>
            <LockKeyhole size={28} aria-hidden="true" />
            <p className="eyebrow">Red Clay Capital</p>
            <h1>Acquisitions Command Center</h1>
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
        </section>
      ) : (
        <section className="admin-command-shell">
          <aside className="admin-sidebar">
            <div className="admin-sidebar-brand">
              <span className="brand-mark" aria-hidden="true">RC</span>
              <div>
                <strong>Red Clay Capital</strong>
                <small>Acquisitions</small>
              </div>
            </div>
            <nav>
              {tabs.map((tab) => (
                <button className={activeTab === tab ? "active" : ""} key={tab} onClick={() => setActiveTab(tab)} type="button">
                  {tab === "Overview" && <LayoutDashboard size={17} />}
                  {tab === "Pipeline" && <Target size={17} />}
                  {tab === "Leads" && <Table2 size={17} />}
                  {tab === "Analytics" && <BarChart3 size={17} />}
                  {tab === "Calendar" && <CalendarDays size={17} />}
                  {tab === "Notifications" && <Clock size={17} />}
                  {tab === "Settings" && <Settings size={17} />}
                  {tab === "Testimonials" && <Star size={17} />}
                  {tab}
                </button>
              ))}
            </nav>
            <a href="/">Back to website</a>
          </aside>

          <div className="admin-workspace">
            <header className="command-header">
              <div>
                <p className="eyebrow">Today&apos;s command view</p>
                <h1>{activeTab}</h1>
              </div>
              <label className="global-search">
                <Search size={17} aria-hidden="true" />
                <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search leads, address, phone, notes..." />
              </label>
              <button className="button secondary" onClick={() => { loadLeads(); loadTestimonials(); }} type="button">Refresh</button>
            </header>

            {activeTab === "Overview" && (
              <>
                <div className="kpi-grid">
                  {kpis.map((kpi) => (
                    <button className="kpi-card" key={kpi.label} onClick={() => setActiveTab(kpi.tab)} type="button">
                      <span>{kpi.label}</span>
                      <strong>{kpi.value}</strong>
                    </button>
                  ))}
                </div>
                <div className="command-grid">
                  <section className="command-panel">
                    <h2>What Needs Attention</h2>
                    {overdue.length ? overdue.map((lead) => (
                      <article className="attention-item" key={lead.id}>
                        <strong>{lead.name}</strong>
                        <span>{lead.address}</span>
                        <button onClick={() => { setSelectedLead(lead); setActiveTab("Leads"); }} type="button">Open Lead</button>
                      </article>
                    )) : <p className="muted">No overdue new leads right now.</p>}
                  </section>
                  <ActivityFeed activity={activity} />
                </div>
              </>
            )}

            {activeTab === "Pipeline" && (
              <section className="pipeline-board">
                {pipelineStages.map((stage) => {
                  const stageLeads = leads.filter((lead) => lead.status === stage);
                  return (
                    <div className="pipeline-column" key={stage} onDragOver={(event) => event.preventDefault()} onDrop={(event) => onDrop(event, stage)}>
                      <header>
                        <strong>{stage}</strong>
                        <span>{stageLeads.length}</span>
                      </header>
                      {stageLeads.map((lead) => (
                        <article
                          className="pipeline-card"
                          draggable
                          key={lead.id}
                          onClick={() => setSelectedLead(lead)}
                          onDragStart={(event) => event.dataTransfer.setData("text/plain", lead.id)}
                        >
                          <span className={`priority priority-${getPriority(lead).toLowerCase()}`}>{getPriority(lead)}</span>
                          <strong>{lead.name}</strong>
                          <small>{lead.address}</small>
                          <em>${estimatedValue(lead).toLocaleString()}</em>
                        </article>
                      ))}
                    </div>
                  );
                })}
              </section>
            )}

            {activeTab === "Leads" && (
              <section className="command-panel">
                <div className="lead-controls">
                  <select value={stageFilter} onChange={(event) => setStageFilter(event.target.value)}>
                    <option>All</option>
                    {[...pipelineStages, "Archived"].map((status) => <option key={status}>{status}</option>)}
                  </select>
                  <select value={sortKey} onChange={(event) => setSortKey(event.target.value as typeof sortKey)}>
                    <option value="submittedAt">Newest first</option>
                    <option value="name">Name</option>
                    <option value="status">Status</option>
                    <option value="value">Estimated value</option>
                  </select>
                  <button className="button secondary" onClick={exportCsv} type="button">
                    <Download size={16} /> CSV Export
                  </button>
                  <button className="button secondary" onClick={() => selectedIds.forEach((id) => updateLeadStatus(id, "Archived"))} type="button" disabled={!selectedIds.length}>
                    Bulk Archive
                  </button>
                </div>
                <div className="acq-table-wrap">
                  <table className="acq-table">
                    <thead>
                      <tr>
                        <th><input type="checkbox" checked={selectedIds.length === pagedLeads.length && pagedLeads.length > 0} onChange={(event) => setSelectedIds(event.target.checked ? pagedLeads.map((lead) => lead.id) : [])} /></th>
                        <th>Priority</th>
                        <th>Lead Name</th>
                        <th>Property Address</th>
                        <th>City</th>
                        <th>Situation</th>
                        <th>Status</th>
                        <th>Assigned To</th>
                        <th>Date Submitted</th>
                        <th>Last Contact</th>
                        <th>Estimated Value</th>
                        <th>Next Task</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pagedLeads.map((lead) => (
                        <tr key={lead.id}>
                          <td><input type="checkbox" checked={selectedIds.includes(lead.id)} onChange={(event) => setSelectedIds((ids) => event.target.checked ? [...ids, lead.id] : ids.filter((id) => id !== lead.id))} /></td>
                          <td><span className={`priority priority-${getPriority(lead).toLowerCase()}`}>{getPriority(lead)}</span></td>
                          <td>{lead.name}</td>
                          <td>{lead.address}</td>
                          <td>{getCity(lead.address)}</td>
                          <td>{lead.propertyCondition || lead.timeline || "Property review"}</td>
                          <td>
                            <select value={lead.status} onChange={(event) => updateLeadStatus(lead.id, event.target.value as LeadStatus)}>
                              {[...pipelineStages, "Archived"].map((status) => <option key={status}>{status}</option>)}
                            </select>
                          </td>
                          <td>Michael Cobb</td>
                          <td>{formatDate(lead.submittedAt)}</td>
                          <td>{lead.status === "New" ? "Not contacted" : `${daysAgo(lead.submittedAt)}d ago`}</td>
                          <td>${estimatedValue(lead).toLocaleString()}</td>
                          <td>{nextTask(lead)}</td>
                          <td>
                            <div className="row-actions">
                              <a href={`tel:${lead.phone}`}><Phone size={14} /> Call</a>
                              <a href={`sms:${lead.phone}`}><MessageSquare size={14} /> Text</a>
                              <a href={`mailto:${lead.email}`}><Mail size={14} /> Email</a>
                              <button onClick={() => setSelectedLead(lead)} type="button">View</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <footer className="table-footer">
                  <span>Page {page} of {totalPages}</span>
                  <button onClick={() => setPage((value) => Math.max(1, value - 1))} type="button">Previous</button>
                  <button onClick={() => setPage((value) => Math.min(totalPages, value + 1))} type="button">Next</button>
                </footer>
              </section>
            )}

            {activeTab === "Analytics" && <AnalyticsPanel leads={leads} />}
            {activeTab === "Calendar" && <CalendarPanel leads={leads} />}
            {activeTab === "Notifications" && <NotificationsPanel leads={leads} />}
            {activeTab === "Settings" && <SettingsPanel />}
            {activeTab === "Testimonials" && (
              <TestimonialsPanel
                message={message}
                reviewSources={reviewSources}
                selectedTestimonial={selectedTestimonial}
                setSelectedTestimonial={setSelectedTestimonial}
                setTestimonialTags={setTestimonialTags}
                testimonialStatuses={testimonialStatuses}
                testimonialTags={testimonialTags}
                testimonials={testimonials}
                onQuickUpdate={quickUpdateTestimonial}
                onSave={saveTestimonial}
              />
            )}
          </div>

          {selectedLead && (
            <aside className="lead-profile">
              <button className="lead-profile-close" onClick={() => setSelectedLead(null)} type="button">Close</button>
              <h2>{selectedLead.name}</h2>
              <p>{selectedLead.address}</p>
              <div className="quick-action-grid">
                <a href={`tel:${selectedLead.phone}`}><Phone size={15} /> Call</a>
                <a href={`sms:${selectedLead.phone}`}><MessageSquare size={15} /> Text</a>
                <a href={`mailto:${selectedLead.email}`}><Mail size={15} /> Email</a>
                <button onClick={() => updateLeadStatus(selectedLead.id, "Contacted")} type="button"><UserCheck size={15} /> Mark Contacted</button>
                <button onClick={() => updateLeadStatus(selectedLead.id, "Offer Sent")} type="button"><FileText size={15} /> Create Offer</button>
                <button onClick={() => updateLeadStatus(selectedLead.id, "Archived")} type="button"><Archive size={15} /> Archive</button>
              </div>
              <dl>
                <dt>Contact Information</dt>
                <dd>{selectedLead.phone || "-"}<br />{selectedLead.email || "-"}</dd>
                <dt>Property Information</dt>
                <dd>{selectedLead.address}<br />{selectedLead.propertyCondition || "Condition not provided"}</dd>
                <dt>Seller Situation</dt>
                <dd>{selectedLead.details || "No notes yet."}</dd>
                <dt>Timeline</dt>
                <dd>{selectedLead.timeline || "Not specified"}</dd>
                <dt>Activity History</dt>
                <dd>Submitted {new Date(selectedLead.submittedAt).toLocaleString()}<br />Current stage: {selectedLead.status}</dd>
                <dt>Tasks</dt>
                <dd>{nextTask(selectedLead)}</dd>
                <dt>Offer Details</dt>
                <dd>Estimated acquisition value: ${estimatedValue(selectedLead).toLocaleString()}</dd>
                <dt>Map</dt>
                <dd><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedLead.address)}`} target="_blank">Open property map</a></dd>
              </dl>
            </aside>
          )}
        </section>
      )}
    </main>
  );
}

function ActivityFeed({ activity }: { activity: Array<{ id: string; date: string; text: string; detail: string }> }) {
  return (
    <section className="command-panel">
      <h2>Live Activity Feed</h2>
      <div className="activity-feed">
        {activity.map((event) => (
          <article key={event.id}>
            <CheckCircle2 size={16} />
            <div>
              <strong>{event.text}</strong>
              <span>{event.detail}</span>
            </div>
            <time>{formatDate(event.date)}</time>
          </article>
        ))}
      </div>
    </section>
  );
}

function AnalyticsPanel({ leads }: { leads: Lead[] }) {
  const byStage = pipelineStages.map((stage) => ({ stage, count: leads.filter((lead) => lead.status === stage).length }));
  const max = Math.max(1, ...byStage.map((item) => item.count));
  const pipelineValue = leads.filter((lead) => !["Closed", "Archived"].includes(lead.status)).reduce((sum, lead) => sum + estimatedValue(lead), 0);
  const closedRevenue = leads.filter((lead) => lead.status === "Closed").reduce((sum, lead) => sum + estimatedValue(lead), 0);

  return (
    <section className="analytics-layout">
      <div className="command-panel">
        <h2>Conversion Funnel</h2>
        <div className="chart-list">
          {byStage.map((item) => (
            <div key={item.stage}>
              <span>{item.stage}</span>
              <i style={{ width: `${(item.count / max) * 100}%` }} />
              <strong>{item.count}</strong>
            </div>
          ))}
        </div>
      </div>
      <div className="command-panel metric-stack">
        <h2>Pipeline Metrics</h2>
        <p><strong>${pipelineValue.toLocaleString()}</strong><span>Pipeline Value</span></p>
        <p><strong>${Math.round(pipelineValue * 0.08).toLocaleString()}</strong><span>Potential Revenue</span></p>
        <p><strong>${closedRevenue.toLocaleString()}</strong><span>Closed Revenue</span></p>
        <p><strong>{leads.length ? Math.round((leads.filter((lead) => lead.status === "Closed").length / leads.length) * 100) : 0}%</strong><span>Overall Close Rate</span></p>
      </div>
    </section>
  );
}

function CalendarPanel({ leads }: { leads: Lead[] }) {
  const events = leads.filter((lead) => lead.status !== "Archived").slice(0, 12);
  return (
    <section className="command-panel">
      <h2>Acquisitions Calendar</h2>
      <div className="calendar-list">
        {events.map((lead, index) => (
          <article key={lead.id}>
            <CalendarDays size={18} />
            <div>
              <strong>{nextTask(lead)}</strong>
              <span>{lead.name} - {lead.address}</span>
            </div>
            <time>{formatDate(new Date(Date.now() + index * 86400000).toISOString())}</time>
          </article>
        ))}
      </div>
    </section>
  );
}

function NotificationsPanel({ leads }: { leads: Lead[] }) {
  const notifications = [
    ...leads.filter((lead) => lead.status === "New").map((lead) => `New lead needs contact: ${lead.name}`),
    ...leads.filter((lead) => lead.status === "Offer Sent").map((lead) => `Offer follow-up due: ${lead.name}`),
    ...leads.filter((lead) => lead.status === "Closing Scheduled").map((lead) => `Closing approaching: ${lead.name}`)
  ];
  return (
    <section className="command-panel">
      <h2>Notification Center</h2>
      <div className="notification-list">
        {(notifications.length ? notifications : ["No urgent notifications right now."]).map((item) => (
          <article key={item}><Clock size={16} /> {item}</article>
        ))}
      </div>
    </section>
  );
}

function SettingsPanel() {
  const settings = ["Business Information", "Email Templates", "SMS Templates", "Notification Rules", "Offer Statuses", "Pipeline Stages", "Users & Permissions", "Attorney Information", "Closing Partners", "Markets Served", "Business Hours"];
  return (
    <section className="settings-grid">
      {settings.map((setting) => (
        <article className="command-panel" key={setting}>
          <h2>{setting}</h2>
          <p className="muted">Configuration-ready section for future production controls.</p>
        </article>
      ))}
    </section>
  );
}

function TestimonialsPanel(props: {
  message: string;
  reviewSources: string[];
  selectedTestimonial: Partial<Testimonial>;
  setSelectedTestimonial: (value: Partial<Testimonial> | ((value: Partial<Testimonial>) => Partial<Testimonial>)) => void;
  setTestimonialTags: (value: string) => void;
  testimonialStatuses: string[];
  testimonialTags: string;
  testimonials: Testimonial[];
  onQuickUpdate: (id: string, changes: Partial<Testimonial>) => void;
  onSave: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <section className="admin-testimonial-grid">
      <form className="command-panel testimonial-form" onSubmit={props.onSave}>
        <h2>{props.selectedTestimonial.id ? "Edit Review" : "Add Review"}</h2>
        <div className="admin-form-grid">
          <label>Customer name<input value={props.selectedTestimonial.customerName || ""} onChange={(event) => props.setSelectedTestimonial((item) => ({ ...item, customerName: event.target.value }))} /></label>
          <label>Last initial<input value={props.selectedTestimonial.lastInitial || ""} onChange={(event) => props.setSelectedTestimonial((item) => ({ ...item, lastInitial: event.target.value }))} /></label>
          <label>City<input value={props.selectedTestimonial.city || ""} onChange={(event) => props.setSelectedTestimonial((item) => ({ ...item, city: event.target.value }))} /></label>
          <label>State<input value={props.selectedTestimonial.state || ""} onChange={(event) => props.setSelectedTestimonial((item) => ({ ...item, state: event.target.value }))} /></label>
          <label>Situation<input value={props.selectedTestimonial.situation || ""} onChange={(event) => props.setSelectedTestimonial((item) => ({ ...item, situation: event.target.value }))} /></label>
          <label>Rating<input min="1" max="5" type="number" value={props.selectedTestimonial.rating || 5} onChange={(event) => props.setSelectedTestimonial((item) => ({ ...item, rating: Number(event.target.value) }))} /></label>
          <label>Source<select value={props.selectedTestimonial.source || "Internal"} onChange={(event) => props.setSelectedTestimonial((item) => ({ ...item, source: event.target.value as Testimonial["source"] }))}>{props.reviewSources.map((source) => <option key={source}>{source}</option>)}</select></label>
          <label>Status<select value={props.selectedTestimonial.status || "Pending"} onChange={(event) => props.setSelectedTestimonial((item) => ({ ...item, status: event.target.value as Testimonial["status"] }))}>{props.testimonialStatuses.map((status) => <option key={status}>{status}</option>)}</select></label>
        </div>
        <label>Review text<textarea value={props.selectedTestimonial.reviewText || ""} onChange={(event) => props.setSelectedTestimonial((item) => ({ ...item, reviewText: event.target.value }))} /></label>
        <label>Tags<input value={props.testimonialTags || (props.selectedTestimonial.tags || []).join(", ")} onChange={(event) => { props.setTestimonialTags(event.target.value); props.setSelectedTestimonial((item) => ({ ...item, tags: event.target.value.split(",").map((tag) => tag.trim()).filter(Boolean) })); }} /></label>
        <label>Closing story highlight<textarea value={props.selectedTestimonial.storyHighlight || ""} onChange={(event) => props.setSelectedTestimonial((item) => ({ ...item, storyHighlight: event.target.value }))} /></label>
        <div className="admin-checkboxes">
          <label><input type="checkbox" checked={Boolean(props.selectedTestimonial.verified)} onChange={(event) => props.setSelectedTestimonial((item) => ({ ...item, verified: event.target.checked }))} />Verified</label>
          <label><input type="checkbox" checked={Boolean(props.selectedTestimonial.featured)} onChange={(event) => props.setSelectedTestimonial((item) => ({ ...item, featured: event.target.checked }))} />Featured</label>
        </div>
        <button className="button" type="submit">Save Review</button>
        {props.message && <p className="admin-message">{props.message}</p>}
      </form>
      <div className="command-panel admin-table-wrap">
        <table className="admin-table testimonial-admin-table">
          <thead><tr><th>Name</th><th>City</th><th>Situation</th><th>Status</th><th>Flags</th></tr></thead>
          <tbody>
            {props.testimonials.map((testimonial) => (
              <tr key={testimonial.id} onClick={() => { props.setSelectedTestimonial(testimonial); props.setTestimonialTags((testimonial.tags || []).join(", ")); }}>
                <td>{testimonial.customerName} {testimonial.lastInitial}</td>
                <td>{testimonial.city}, {testimonial.state}</td>
                <td>{testimonial.situation}</td>
                <td>{testimonial.status}</td>
                <td>
                  <button className={testimonial.featured ? "flag-button active" : "flag-button"} onClick={(event) => { event.stopPropagation(); props.onQuickUpdate(testimonial.id, { featured: !testimonial.featured }); }} type="button">Featured</button>
                  <button className={testimonial.verified ? "flag-button active" : "flag-button"} onClick={(event) => { event.stopPropagation(); props.onQuickUpdate(testimonial.id, { verified: !testimonial.verified }); }} type="button">Verified</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
