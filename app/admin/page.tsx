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
  Plus,
  RefreshCw,
  Save,
  Search,
  Settings,
  Star,
  Table2,
  Target,
  Trash2,
  UserCheck,
  X
} from "lucide-react";

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
  adminNotes?: string;
  tasks?: string[];
  assignedTo?: string;
  lastContactedAt?: string;
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

type Template = { id: string; name: string; subject?: string; body: string };
type NotificationRule = { id: string; name: string; enabled: boolean; timingMinutes: number; channels: { inApp: boolean; email: boolean; sms: boolean }; recipients: string };
type OfferStatus = { id: string; name: string; color: string; enabled: boolean };
type PipelineStageConfig = { id: string; name: string; color: string; probability: number; type: "active" | "closed" | "lost"; enabled: boolean };
type AdminUser = { id: string; name: string; email: string; role: "Admin" | "Acquisition Manager" | "VA" | "Disposition Manager" | "Read Only"; enabled: boolean; permissions: string[] };
type ClosingPartner = { id: string; partnerName: string; contactName: string; email: string; phone: string; market: string; notes: string; active: boolean };
type MarketServed = { id: string; state: string; city: string; county: string; active: boolean; pageUrl: string; defaultClosingPartner: string; notes: string };
type BusinessHoursDay = { day: string; open: boolean; openTime: string; closeTime: string };

type DashboardSettings = {
  business: {
    businessName: string;
    websiteUrl: string;
    mainPhone: string;
    mainEmail: string;
    businessAddress: string;
    logoUrl: string;
    primaryColor: string;
    accentColor: string;
    defaultMarket: string;
    companyDescription: string;
    footerDisclaimer: string;
  };
  emailTemplates: Template[];
  smsTemplates: Template[];
  notificationRules: NotificationRule[];
  offerStatuses: OfferStatus[];
  pipelineStages: PipelineStageConfig[];
  users: AdminUser[];
  attorney: {
    attorneyName: string;
    lawFirm: string;
    contactPerson: string;
    email: string;
    phone: string;
    address: string;
    notes: string;
    marketsServed: string;
  };
  closingPartners: ClosingPartner[];
  marketsServed: MarketServed[];
  businessHours: {
    days: BusinessHoursDay[];
    holidayClosures: string;
    afterHoursMessage: string;
  };
};

type AdminEvent = { id: string; title: string; date: string; type: "Follow-up" | "Appointment" | "Closing" | "Deadline"; leadId?: string; leadName?: string; notes?: string };
type AdminNotification = { id: string; createdAt: string; type: "Lead" | "Task" | "Closing" | "Offer" | "Testimonial" | "System"; title: string; message: string; read: boolean; leadId?: string };

const pipelineStages: LeadStatus[] = ["New", "Contacted", "Property Review", "Offer Sent", "Negotiating", "Under Contract", "Title Work", "Closing Scheduled", "Closed"];
const testimonialStatuses = ["Pending", "Approved", "Hidden"];
const reviewSources = ["Seller Feedback", "Internal", "Google", "Facebook", "Zillow"];
const tabs = ["Overview", "Pipeline", "Leads", "Analytics", "Calendar", "Notifications", "Settings", "Testimonials"] as const;
type AdminTab = (typeof tabs)[number];
type SettingsKey = keyof DashboardSettings;

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

const settingCards: Array<{ key: SettingsKey; title: string; description: string }> = [
  { key: "business", title: "Business Information", description: "Brand, contact, market, disclaimer, and public-facing defaults." },
  { key: "emailTemplates", title: "Email Templates", description: "Admin, seller, offer, appointment, closing, and review emails." },
  { key: "smsTemplates", title: "SMS Templates", description: "Short seller messages with variables and character counts." },
  { key: "notificationRules", title: "Notification Rules", description: "In-app, email, SMS-ready alerts and timing rules." },
  { key: "offerStatuses", title: "Offer Statuses", description: "Offer workflow labels, colors, and active states." },
  { key: "pipelineStages", title: "Pipeline Stages", description: "Board stages, probabilities, colors, and active/closed/lost type." },
  { key: "users", title: "Users & Permissions", description: "Invite-ready users, roles, permissions, and enabled access." },
  { key: "attorney", title: "Attorney Information", description: "Closing attorney, law firm, contact details, and notes." },
  { key: "closingPartners", title: "Closing Partners", description: "Manage multiple closing partners by market." },
  { key: "marketsServed", title: "Markets Served", description: "Cities, counties, page URLs, partners, and activity." },
  { key: "businessHours", title: "Business Hours", description: "Open days, hours, holidays, and after-hours response." }
];

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
  if (lead.tasks?.length) return lead.tasks[0];
  if (lead.status === "New") return "Call seller";
  if (lead.status === "Contacted") return "Complete property review";
  if (lead.status === "Property Review") return "Prepare offer";
  if (lead.status === "Offer Sent") return "Follow up on offer";
  if (lead.status === "Negotiating") return "Resolve seller questions";
  if (lead.status === "Under Contract") return "Send to attorney";
  if (lead.status === "Title Work") return "Confirm title status";
  if (lead.status === "Closing Scheduled") return "Confirm funding";
  if (lead.status === "Closed") return "Request review";
  return "No active task";
}

function uid(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>("Overview");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [settings, setSettings] = useState<DashboardSettings | null>(null);
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Partial<Testimonial>>(emptyTestimonial);
  const [testimonialTags, setTestimonialTags] = useState("");
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("All");
  const [sortKey, setSortKey] = useState<"submittedAt" | "name" | "status" | "value">("submittedAt");
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState("");
  const [toast, setToast] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [settingsView, setSettingsView] = useState<SettingsKey | null>(null);

  const passwordParam = useMemo(() => new URLSearchParams({ password }).toString(), [password]);
  const leadQuery = useMemo(() => {
    const params = new URLSearchParams({ password });
    if (search) params.set("search", search);
    return params.toString();
  }, [password, search]);

  function showToast(text: string) {
    setToast(text);
    window.setTimeout(() => setToast(""), 2600);
  }

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
    const response = await fetch(`/api/admin/testimonials?${passwordParam}`, { cache: "no-store" });
    if (!response.ok) {
      if (!keepAuth) setAuthed(false);
      return false;
    }
    const data = (await response.json()) as { testimonials: Testimonial[] };
    setTestimonials(data.testimonials);
    return true;
  }

  async function loadSettings({ keepAuth = true } = {}) {
    const response = await fetch(`/api/admin/settings?${passwordParam}`, { cache: "no-store" });
    if (!response.ok) {
      if (!keepAuth) setAuthed(false);
      return false;
    }
    const data = (await response.json()) as { settings: DashboardSettings };
    setSettings(data.settings);
    return true;
  }

  async function loadEvents({ keepAuth = true } = {}) {
    const response = await fetch(`/api/admin/events?${passwordParam}`, { cache: "no-store" });
    if (!response.ok) {
      if (!keepAuth) setAuthed(false);
      return false;
    }
    const data = (await response.json()) as { events: AdminEvent[] };
    setEvents(data.events);
    return true;
  }

  async function loadNotifications({ keepAuth = true } = {}) {
    const response = await fetch(`/api/admin/notifications?${passwordParam}`, { cache: "no-store" });
    if (!response.ok) {
      if (!keepAuth) setAuthed(false);
      return false;
    }
    const data = (await response.json()) as { notifications: AdminNotification[] };
    setNotifications(data.notifications);
    return true;
  }

  async function refreshAll() {
    setRefreshing(true);
    try {
      const results = await Promise.all([loadLeads(), loadTestimonials(), loadSettings(), loadEvents(), loadNotifications()]);
      if (results.every(Boolean)) showToast("Dashboard refreshed.");
      else showToast("Refresh failed. Check password or API.");
    } finally {
      setRefreshing(false);
    }
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setRefreshing(true);
    const results = await Promise.all([
      loadLeads({ keepAuth: false }),
      loadTestimonials({ keepAuth: false }),
      loadSettings({ keepAuth: false }),
      loadEvents({ keepAuth: false }),
      loadNotifications({ keepAuth: false })
    ]);
    setRefreshing(false);
    setAuthed(results.every(Boolean));
  }

  useEffect(() => {
    if (!authed) return;
    const timer = window.setInterval(refreshAll, 30000);
    return () => window.clearInterval(timer);
  }, [authed, leadQuery, passwordParam]);

  async function saveSettings(next = settings) {
    if (!next) return;
    setSaving(true);
    const response = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, settings: next })
    });
    setSaving(false);
    if (!response.ok) {
      showToast("Settings save failed.");
      return;
    }
    const data = (await response.json()) as { settings: DashboardSettings };
    setSettings(data.settings);
    showToast("Settings saved.");
  }

  async function updateLeadRecord(id: string, changes: Partial<Lead>) {
    const previous = leads;
    setLeads((items) => items.map((lead) => (lead.id === id ? { ...lead, ...changes } : lead)));
    setSelectedLead((lead) => (lead && lead.id === id ? { ...lead, ...changes } : lead));
    const response = await fetch("/api/admin/leads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, id, ...changes })
    });
    if (!response.ok) {
      setLeads(previous);
      showToast("Lead update failed.");
      return;
    }
    await loadLeads();
    showToast("Lead saved.");
  }

  function onDrop(event: DragEvent<HTMLDivElement>, status: LeadStatus) {
    event.preventDefault();
    const id = event.dataTransfer.getData("text/plain");
    if (id) updateLeadRecord(id, { status, lastContactedAt: status === "Contacted" ? new Date().toISOString() : undefined });
  }

  async function saveEvent(event: Partial<AdminEvent>) {
    const method = event.id ? "PATCH" : "POST";
    const response = await fetch("/api/admin/events", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...event, password })
    });
    if (!response.ok) {
      const data = await response.json();
      showToast(data.error || "Event save failed.");
      return;
    }
    await loadEvents();
    showToast("Calendar event saved.");
  }

  async function deleteEvent(id: string) {
    const response = await fetch(`/api/admin/events?${passwordParam}&id=${encodeURIComponent(id)}`, { method: "DELETE" });
    if (!response.ok) {
      showToast("Event delete failed.");
      return;
    }
    await loadEvents();
    showToast("Event deleted.");
  }

  async function updateNotification(id: string, changes: Partial<AdminNotification>) {
    const response = await fetch("/api/admin/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, id, ...changes })
    });
    if (!response.ok) {
      showToast("Notification update failed.");
      return;
    }
    await loadNotifications();
  }

  async function markAllNotificationsRead() {
    const response = await fetch("/api/admin/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, markAllRead: true })
    });
    if (!response.ok) {
      showToast("Unable to mark notifications read.");
      return;
    }
    await loadNotifications();
    showToast("Notifications marked read.");
  }

  async function deleteNotification(id: string) {
    const response = await fetch(`/api/admin/notifications?${passwordParam}&id=${encodeURIComponent(id)}`, { method: "DELETE" });
    if (!response.ok) {
      showToast("Notification delete failed.");
      return;
    }
    await loadNotifications();
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
      showToast(data.error || "Unable to save testimonial.");
      return;
    }
    showToast("Review saved.");
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
      showToast("Review updated.");
    } else {
      showToast("Review update failed.");
    }
  }

  async function deleteTestimonial(id: string) {
    const response = await fetch(`/api/admin/testimonials?${passwordParam}&id=${encodeURIComponent(id)}`, { method: "DELETE" });
    if (!response.ok) {
      showToast("Review delete failed.");
      return;
    }
    await loadTestimonials();
    showToast("Review deleted.");
  }

  function exportCsv() {
    window.location.href = `/api/admin/leads?${leadQuery}&format=csv`;
  }

  const filteredLeads = useMemo(() => {
    const query = search.toLowerCase();
    return leads
      .filter((lead) => stageFilter === "All" || lead.status === stageFilter)
      .filter((lead) =>
        [
          lead.name,
          lead.address,
          lead.phone,
          lead.email,
          lead.details,
          lead.propertyCondition,
          lead.timeline,
          lead.adminNotes,
          lead.assignedTo,
          ...(lead.tasks || []),
          ...Object.values(lead.utmParams || {})
        ].join(" ").toLowerCase().includes(query)
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
    { label: "Calendar Events", value: events.length, tab: "Calendar" as AdminTab },
    { label: "Projected Pipeline Value", value: `$${Math.round(pipelineValue / 1000)}k`, tab: "Analytics" as AdminTab },
    { label: "Conversion Rate", value: `${leads.length ? Math.round((closedLeads.length / leads.length) * 100) : 0}%`, tab: "Analytics" as AdminTab },
    { label: "Unread Alerts", value: notifications.filter((item) => !item.read).length, tab: "Notifications" as AdminTab },
    { label: "Average Days to Close", value: leads.length ? `${Math.max(7, Math.round(leads.reduce((sum, lead) => sum + daysAgo(lead.submittedAt), 0) / leads.length))}d` : "0d", tab: "Analytics" as AdminTab }
  ];
  const activity = leads.flatMap((lead) => [
    { id: `${lead.id}-new`, date: lead.submittedAt, text: `New lead submitted by ${lead.name}`, detail: lead.address },
    { id: `${lead.id}-status`, date: lead.submittedAt, text: `Status set to ${lead.status}`, detail: nextTask(lead) }
  ]).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 12);
  const overdue = leads.filter((lead) => lead.status === "New" && daysAgo(lead.submittedAt) >= 1);

  return (
    <main className="admin-command-page">
      {toast && <div className="admin-toast">{toast}</div>}
      {!authed ? (
        <section className="admin-auth-shell">
          <form className="admin-command-login" onSubmit={handleLogin}>
            <LockKeyhole size={28} aria-hidden="true" />
            <p className="eyebrow">Red Clay Capital</p>
            <h1>Acquisitions Command Center</h1>
            <label htmlFor="admin-password">Password</label>
            <input id="admin-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" />
            <button className="button" type="submit" disabled={refreshing}>{refreshing ? "Opening..." : "Open Dashboard"}</button>
            {message && <p className="admin-message">{message}</p>}
          </form>
        </section>
      ) : (
        <section className="admin-command-shell">
          <aside className="admin-sidebar">
            <div className="admin-sidebar-brand">
              <span className="brand-mark" aria-hidden="true">RC</span>
              <div><strong>Red Clay Capital</strong><small>Acquisitions</small></div>
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
              <div><p className="eyebrow">Today&apos;s command view</p><h1>{activeTab}</h1></div>
              <label className="global-search">
                <Search size={17} aria-hidden="true" />
                <input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search leads, address, phone, notes, tasks..." />
              </label>
              <button className="button secondary" onClick={refreshAll} type="button" disabled={refreshing}>
                <RefreshCw size={16} className={refreshing ? "spin" : ""} /> {refreshing ? "Refreshing" : "Refresh"}
              </button>
            </header>

            {activeTab === "Overview" && (
              <>
                <div className="kpi-grid">
                  {kpis.map((kpi) => <button className="kpi-card" key={kpi.label} onClick={() => setActiveTab(kpi.tab)} type="button"><span>{kpi.label}</span><strong>{kpi.value}</strong></button>)}
                </div>
                <div className="command-grid">
                  <section className="command-panel">
                    <h2>What Needs Attention</h2>
                    {overdue.length ? overdue.map((lead) => <article className="attention-item" key={lead.id}><strong>{lead.name}</strong><span>{lead.address}</span><button onClick={() => { setSelectedLead(lead); setActiveTab("Leads"); }} type="button">Open Lead</button></article>) : <p className="muted">No overdue new leads right now.</p>}
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
                      <header><strong>{stage}</strong><span>{stageLeads.length}</span></header>
                      {stageLeads.length ? stageLeads.map((lead) => (
                        <article className="pipeline-card" draggable key={lead.id} onClick={() => setSelectedLead(lead)} onDragStart={(event) => event.dataTransfer.setData("text/plain", lead.id)}>
                          <span className={`priority priority-${getPriority(lead).toLowerCase()}`}>{getPriority(lead)}</span>
                          <strong>{lead.name}</strong><small>{lead.address}</small><em>${estimatedValue(lead).toLocaleString()}</em>
                        </article>
                      )) : <p className="muted">Drop leads here.</p>}
                    </div>
                  );
                })}
              </section>
            )}

            {activeTab === "Leads" && (
              <section className="command-panel">
                <div className="lead-controls">
                  <select value={stageFilter} onChange={(event) => setStageFilter(event.target.value)}>
                    <option>All</option>{[...pipelineStages, "Archived"].map((status) => <option key={status}>{status}</option>)}
                  </select>
                  <select value={sortKey} onChange={(event) => setSortKey(event.target.value as typeof sortKey)}>
                    <option value="submittedAt">Newest first</option><option value="name">Name</option><option value="status">Status</option><option value="value">Estimated value</option>
                  </select>
                  <button className="button secondary" onClick={exportCsv} type="button"><Download size={16} /> CSV Export</button>
                  <button className="button secondary" onClick={() => selectedIds.forEach((id) => updateLeadRecord(id, { status: "Archived" }))} type="button" disabled={!selectedIds.length}>Bulk Archive</button>
                </div>
                <div className="acq-table-wrap">
                  <table className="acq-table">
                    <thead><tr><th><input type="checkbox" checked={selectedIds.length === pagedLeads.length && pagedLeads.length > 0} onChange={(event) => setSelectedIds(event.target.checked ? pagedLeads.map((lead) => lead.id) : [])} /></th><th>Priority</th><th>Lead Name</th><th>Property Address</th><th>City</th><th>Situation</th><th>Status</th><th>Assigned To</th><th>Date Submitted</th><th>Last Contact</th><th>Estimated Value</th><th>Next Task</th><th>Actions</th></tr></thead>
                    <tbody>
                      {pagedLeads.length ? pagedLeads.map((lead) => (
                        <tr key={lead.id}>
                          <td><input type="checkbox" checked={selectedIds.includes(lead.id)} onChange={(event) => setSelectedIds((ids) => event.target.checked ? [...ids, lead.id] : ids.filter((id) => id !== lead.id))} /></td>
                          <td><span className={`priority priority-${getPriority(lead).toLowerCase()}`}>{getPriority(lead)}</span></td>
                          <td>{lead.name}</td><td>{lead.address}</td><td>{getCity(lead.address)}</td><td>{lead.propertyCondition || lead.timeline || "Property review"}</td>
                          <td><select value={lead.status} onChange={(event) => updateLeadRecord(lead.id, { status: event.target.value as LeadStatus })}>{[...pipelineStages, "Archived"].map((status) => <option key={status}>{status}</option>)}</select></td>
                          <td>{lead.assignedTo || "Michael Cobb"}</td><td>{formatDate(lead.submittedAt)}</td><td>{lead.lastContactedAt ? formatDate(lead.lastContactedAt) : "Not contacted"}</td><td>${estimatedValue(lead).toLocaleString()}</td><td>{nextTask(lead)}</td>
                          <td><div className="row-actions"><a href={`tel:${lead.phone}`}><Phone size={14} /> Call</a><a href={`sms:${lead.phone}`}><MessageSquare size={14} /> Text</a><a href={`mailto:${lead.email}`}><Mail size={14} /> Email</a><button onClick={() => setSelectedLead(lead)} type="button">View</button></div></td>
                        </tr>
                      )) : <tr><td colSpan={13}>No leads match the current filters.</td></tr>}
                    </tbody>
                  </table>
                </div>
                <footer className="table-footer"><span>Page {page} of {totalPages}</span><button onClick={() => setPage((value) => Math.max(1, value - 1))} type="button" disabled={page === 1}>Previous</button><button onClick={() => setPage((value) => Math.min(totalPages, value + 1))} type="button" disabled={page === totalPages}>Next</button></footer>
              </section>
            )}

            {activeTab === "Analytics" && <AnalyticsPanel leads={leads} />}
            {activeTab === "Calendar" && <CalendarPanel events={events} leads={leads} onDelete={deleteEvent} onSave={saveEvent} />}
            {activeTab === "Notifications" && <NotificationsPanel leads={leads} notifications={notifications} onDelete={deleteNotification} onMarkAllRead={markAllNotificationsRead} onUpdate={updateNotification} openLead={(lead) => setSelectedLead(lead)} />}
            {activeTab === "Settings" && settings && <SettingsPanel settings={settings} settingsView={settingsView} saving={saving} setSettings={setSettings} setSettingsView={setSettingsView} onSave={saveSettings} />}
            {activeTab === "Testimonials" && <TestimonialsPanel reviewSources={reviewSources} selectedTestimonial={selectedTestimonial} setSelectedTestimonial={setSelectedTestimonial} setTestimonialTags={setTestimonialTags} testimonialStatuses={testimonialStatuses} testimonialTags={testimonialTags} testimonials={testimonials} onDelete={deleteTestimonial} onQuickUpdate={quickUpdateTestimonial} onSave={saveTestimonial} />}
          </div>

          {selectedLead && <LeadProfile lead={selectedLead} onClose={() => setSelectedLead(null)} onSave={updateLeadRecord} />}
        </section>
      )}
    </main>
  );
}

function ActivityFeed({ activity }: { activity: Array<{ id: string; date: string; text: string; detail: string }> }) {
  return <section className="command-panel"><h2>Live Activity Feed</h2><div className="activity-feed">{activity.length ? activity.map((event) => <article key={event.id}><CheckCircle2 size={16} /><div><strong>{event.text}</strong><span>{event.detail}</span></div><time>{formatDate(event.date)}</time></article>) : <p className="muted">Activity appears here as leads move through the pipeline.</p>}</div></section>;
}

function AnalyticsPanel({ leads }: { leads: Lead[] }) {
  const byStage = pipelineStages.map((stage) => ({ stage, count: leads.filter((lead) => lead.status === stage).length }));
  const max = Math.max(1, ...byStage.map((item) => item.count));
  const pipelineValue = leads.filter((lead) => !["Closed", "Archived"].includes(lead.status)).reduce((sum, lead) => sum + estimatedValue(lead), 0);
  const closedRevenue = leads.filter((lead) => lead.status === "Closed").reduce((sum, lead) => sum + estimatedValue(lead), 0);
  return (
    <section className="analytics-layout">
      <div className="command-panel"><h2>Conversion Funnel</h2><div className="chart-list">{byStage.map((item) => <div key={item.stage}><span>{item.stage}</span><i style={{ width: `${(item.count / max) * 100}%` }} /><strong>{item.count}</strong></div>)}</div></div>
      <div className="command-panel metric-stack"><h2>Pipeline Metrics</h2><p><strong>${pipelineValue.toLocaleString()}</strong><span>Pipeline Value</span></p><p><strong>${Math.round(pipelineValue * 0.08).toLocaleString()}</strong><span>Potential Revenue</span></p><p><strong>${closedRevenue.toLocaleString()}</strong><span>Closed Revenue</span></p><p><strong>{leads.length ? Math.round((leads.filter((lead) => lead.status === "Closed").length / leads.length) * 100) : 0}%</strong><span>Overall Close Rate</span></p></div>
    </section>
  );
}

function CalendarPanel(props: { events: AdminEvent[]; leads: Lead[]; onSave: (event: Partial<AdminEvent>) => void; onDelete: (id: string) => void }) {
  const [draft, setDraft] = useState<Partial<AdminEvent>>({ title: "", date: new Date().toISOString().slice(0, 10), type: "Follow-up", leadId: "", notes: "" });
  const selectedLead = props.leads.find((lead) => lead.id === draft.leadId);
  return (
    <section className="command-grid">
      <form className="command-panel admin-mini-form" onSubmit={(event) => { event.preventDefault(); props.onSave({ ...draft, leadName: selectedLead?.name || draft.leadName }); setDraft({ title: "", date: new Date().toISOString().slice(0, 10), type: "Follow-up", leadId: "", notes: "" }); }}>
        <h2>{draft.id ? "Edit Calendar Event" : "Create Calendar Event"}</h2>
        <label>Title<input value={draft.title || ""} onChange={(event) => setDraft((item) => ({ ...item, title: event.target.value }))} required /></label>
        <label>Date<input type="date" value={draft.date || ""} onChange={(event) => setDraft((item) => ({ ...item, date: event.target.value }))} required /></label>
        <label>Type<select value={draft.type || "Follow-up"} onChange={(event) => setDraft((item) => ({ ...item, type: event.target.value as AdminEvent["type"] }))}><option>Follow-up</option><option>Appointment</option><option>Closing</option><option>Deadline</option></select></label>
        <label>Related lead<select value={draft.leadId || ""} onChange={(event) => setDraft((item) => ({ ...item, leadId: event.target.value }))}><option value="">None</option>{props.leads.map((lead) => <option key={lead.id} value={lead.id}>{lead.name} - {lead.address}</option>)}</select></label>
        <label>Notes<textarea value={draft.notes || ""} onChange={(event) => setDraft((item) => ({ ...item, notes: event.target.value }))} /></label>
        <button className="button" type="submit"><Save size={16} /> Save Event</button>
      </form>
      <section className="command-panel"><h2>Acquisitions Calendar</h2><div className="calendar-list">{props.events.length ? props.events.map((event) => <article key={event.id}><CalendarDays size={18} /><div><strong>{event.title}</strong><span>{event.type}{event.leadName ? ` - ${event.leadName}` : ""}{event.notes ? ` - ${event.notes}` : ""}</span></div><time>{formatDate(event.date)}</time><button type="button" onClick={() => setDraft(event)}>Edit</button><button type="button" onClick={() => props.onDelete(event.id)}><Trash2 size={15} /></button></article>) : <p className="muted">No calendar events yet. Create one to track follow-ups, closings, appointments, or deadlines.</p>}</div></section>
    </section>
  );
}

function NotificationsPanel(props: { notifications: AdminNotification[]; leads: Lead[]; onUpdate: (id: string, changes: Partial<AdminNotification>) => void; onDelete: (id: string) => void; onMarkAllRead: () => void; openLead: (lead: Lead) => void }) {
  const [filter, setFilter] = useState("All");
  const filtered = props.notifications.filter((item) => filter === "All" || (filter === "Unread" ? !item.read : item.type === filter));
  return (
    <section className="command-panel">
      <div className="panel-heading"><h2>Notification Center</h2><div className="row-actions"><select value={filter} onChange={(event) => setFilter(event.target.value)}><option>All</option><option>Unread</option><option>Lead</option><option>Task</option><option>Closing</option><option>Offer</option><option>Testimonial</option><option>System</option></select><button type="button" onClick={props.onMarkAllRead}>Mark all read</button></div></div>
      <div className="notification-list">{filtered.length ? filtered.map((item) => {
        const lead = props.leads.find((lead) => lead.id === item.leadId);
        return <article key={item.id} className={item.read ? "is-read" : ""}><Clock size={16} /><div><strong>{item.title}</strong><span>{item.message}</span><time>{formatDate(item.createdAt)}</time></div>{lead && <button type="button" onClick={() => props.openLead(lead)}>Open lead</button>}<button type="button" onClick={() => props.onUpdate(item.id, { read: !item.read })}>{item.read ? "Unread" : "Read"}</button><button type="button" onClick={() => props.onDelete(item.id)}><Trash2 size={15} /></button></article>;
      }) : <p className="muted">No notifications match this filter.</p>}</div>
    </section>
  );
}

function SettingsPanel(props: { settings: DashboardSettings; settingsView: SettingsKey | null; saving: boolean; setSettings: (value: DashboardSettings | ((value: DashboardSettings | null) => DashboardSettings | null)) => void; setSettingsView: (value: SettingsKey | null) => void; onSave: (settings?: DashboardSettings | null) => void }) {
  const update = (changes: Partial<DashboardSettings>) => props.setSettings((settings) => settings ? { ...settings, ...changes } : settings);
  if (props.settingsView) return <SettingsEditor settings={props.settings} view={props.settingsView} saving={props.saving} update={update} setSettings={props.setSettings} onBack={() => props.setSettingsView(null)} onSave={() => props.onSave()} />;
  return <section className="settings-grid">{settingCards.map((card) => <button className="command-panel settings-card" key={card.key} onClick={() => props.setSettingsView(card.key)} type="button"><h2>{card.title}</h2><p className="muted">{card.description}</p><span>Configure</span></button>)}</section>;
}

function SettingsEditor(props: { settings: DashboardSettings; view: SettingsKey; saving: boolean; update: (changes: Partial<DashboardSettings>) => void; setSettings: (value: DashboardSettings | ((value: DashboardSettings | null) => DashboardSettings | null)) => void; onBack: () => void; onSave: () => void }) {
  const title = settingCards.find((card) => card.key === props.view)?.title || "Settings";
  const updateArray = <T extends { id: string }>(key: SettingsKey, items: T[]) => props.update({ [key]: items } as Partial<DashboardSettings>);
  return (
    <section className="command-panel settings-editor">
      <div className="panel-heading"><button type="button" onClick={props.onBack}><X size={16} /> All Settings</button><h2>{title}</h2><button className="button" type="button" onClick={props.onSave} disabled={props.saving}><Save size={16} /> {props.saving ? "Saving..." : "Save"}</button></div>
      {props.view === "business" && <BusinessSettings settings={props.settings} update={props.update} />}
      {props.view === "emailTemplates" && <TemplateSettings items={props.settings.emailTemplates} type="email" onChange={(items) => updateArray("emailTemplates", items)} />}
      {props.view === "smsTemplates" && <TemplateSettings items={props.settings.smsTemplates} type="sms" onChange={(items) => updateArray("smsTemplates", items)} />}
      {props.view === "notificationRules" && <RuleSettings items={props.settings.notificationRules} onChange={(items) => updateArray("notificationRules", items)} />}
      {props.view === "offerStatuses" && <StatusSettings items={props.settings.offerStatuses} onChange={(items) => updateArray("offerStatuses", items)} />}
      {props.view === "pipelineStages" && <PipelineSettings items={props.settings.pipelineStages} onChange={(items) => updateArray("pipelineStages", items)} />}
      {props.view === "users" && <UserSettings items={props.settings.users} onChange={(items) => updateArray("users", items)} />}
      {props.view === "attorney" && <AttorneySettings settings={props.settings} update={props.update} />}
      {props.view === "closingPartners" && <PartnerSettings items={props.settings.closingPartners} onChange={(items) => updateArray("closingPartners", items)} />}
      {props.view === "marketsServed" && <MarketSettings items={props.settings.marketsServed} onChange={(items) => updateArray("marketsServed", items)} />}
      {props.view === "businessHours" && <HoursSettings settings={props.settings} update={props.update} />}
    </section>
  );
}

function BusinessSettings({ settings, update }: { settings: DashboardSettings; update: (changes: Partial<DashboardSettings>) => void }) {
  const business = settings.business;
  const set = (key: keyof DashboardSettings["business"], value: string) => update({ business: { ...business, [key]: value } });
  return <div className="admin-form-grid wide">{Object.entries(business).map(([key, value]) => <label key={key}>{key.replace(/([A-Z])/g, " $1")}<textarea value={value} onChange={(event) => set(key as keyof DashboardSettings["business"], event.target.value)} /></label>)}</div>;
}

function TemplateSettings({ items, type, onChange }: { items: Template[]; type: "email" | "sms"; onChange: (items: Template[]) => void }) {
  return <div className="form-list"><button type="button" onClick={() => onChange([...items, { id: uid(type), name: "New template", subject: type === "email" ? "Subject" : "", body: "" }])}><Plus size={15} /> Add Template</button>{items.map((item, index) => <article key={item.id}><label>Name<input value={item.name} onChange={(event) => onChange(items.map((row) => row.id === item.id ? { ...row, name: event.target.value } : row))} /></label>{type === "email" && <label>Subject<input value={item.subject || ""} onChange={(event) => onChange(items.map((row) => row.id === item.id ? { ...row, subject: event.target.value } : row))} /></label>}<label>Body<textarea value={item.body} onChange={(event) => onChange(items.map((row) => row.id === item.id ? { ...row, body: event.target.value } : row))} /></label><small>{item.body.length} characters. Variables supported: {"{{seller_name}}, {{property_address}}, {{offer_amount}}, {{closing_date}}, {{admin_name}}, {{business_phone}}, {{business_email}}"}</small><details><summary>Preview</summary><p>{item.body.replaceAll("{{seller_name}}", "Taylor Seller").replaceAll("{{property_address}}", "123 Main St").replaceAll("{{offer_amount}}", "$185,000").replaceAll("{{closing_date}}", "July 30").replaceAll("{{admin_name}}", "Michael Cobb").replaceAll("{{business_phone}}", "(888) 626-3213").replaceAll("{{business_email}}", "offers@redclaycap.com")}</p></details><button type="button" onClick={() => onChange(items.filter((row) => row.id !== item.id))}><Trash2 size={15} /> Delete</button>{index > 0 && <button type="button" onClick={() => { const next = [...items]; [next[index - 1], next[index]] = [next[index], next[index - 1]]; onChange(next); }}>Move Up</button>}</article>)}</div>;
}

function RuleSettings({ items, onChange }: { items: NotificationRule[]; onChange: (items: NotificationRule[]) => void }) {
  return <div className="form-list"><button type="button" onClick={() => onChange([...items, { id: uid("rule"), name: "New rule", enabled: true, timingMinutes: 30, channels: { inApp: true, email: false, sms: false }, recipients: "Admin" }])}><Plus size={15} /> Add Rule</button>{items.map((item) => <article key={item.id}><label>Name<input value={item.name} onChange={(event) => onChange(items.map((row) => row.id === item.id ? { ...row, name: event.target.value } : row))} /></label><label>Timing minutes<input type="number" value={item.timingMinutes} onChange={(event) => onChange(items.map((row) => row.id === item.id ? { ...row, timingMinutes: Number(event.target.value) } : row))} /></label><label>Recipients<input value={item.recipients} onChange={(event) => onChange(items.map((row) => row.id === item.id ? { ...row, recipients: event.target.value } : row))} /></label><div className="admin-checkboxes"><label><input type="checkbox" checked={item.enabled} onChange={(event) => onChange(items.map((row) => row.id === item.id ? { ...row, enabled: event.target.checked } : row))} />Enabled</label>{(["inApp", "email", "sms"] as const).map((channel) => <label key={channel}><input type="checkbox" checked={item.channels[channel]} onChange={(event) => onChange(items.map((row) => row.id === item.id ? { ...row, channels: { ...row.channels, [channel]: event.target.checked } } : row))} />{channel}</label>)}</div><button type="button" onClick={() => onChange(items.filter((row) => row.id !== item.id))}><Trash2 size={15} /> Delete</button></article>)}</div>;
}

function StatusSettings({ items, onChange }: { items: OfferStatus[]; onChange: (items: OfferStatus[]) => void }) {
  return <div className="form-list"><button type="button" onClick={() => onChange([...items, { id: uid("status"), name: "New Status", color: "#9f321f", enabled: true }])}><Plus size={15} /> Add Status</button>{items.map((item, index) => <article key={item.id}><label>Name<input value={item.name} onChange={(event) => onChange(items.map((row) => row.id === item.id ? { ...row, name: event.target.value } : row))} /></label><label>Color<input type="color" value={item.color} onChange={(event) => onChange(items.map((row) => row.id === item.id ? { ...row, color: event.target.value } : row))} /></label><label><input type="checkbox" checked={item.enabled} onChange={(event) => onChange(items.map((row) => row.id === item.id ? { ...row, enabled: event.target.checked } : row))} />Enabled</label>{index > 0 && <button type="button" onClick={() => { const next = [...items]; [next[index - 1], next[index]] = [next[index], next[index - 1]]; onChange(next); }}>Move Up</button>}<button type="button" onClick={() => onChange(items.filter((row) => row.id !== item.id))}><Trash2 size={15} /> Delete</button></article>)}</div>;
}

function PipelineSettings({ items, onChange }: { items: PipelineStageConfig[]; onChange: (items: PipelineStageConfig[]) => void }) {
  return <div className="form-list"><button type="button" onClick={() => onChange([...items, { id: uid("stage"), name: "New Stage", color: "#9f321f", probability: 10, type: "active", enabled: true }])}><Plus size={15} /> Add Stage</button>{items.map((item, index) => <article key={item.id}><label>Name<input value={item.name} onChange={(event) => onChange(items.map((row) => row.id === item.id ? { ...row, name: event.target.value } : row))} /></label><label>Probability<input type="number" min="0" max="100" value={item.probability} onChange={(event) => onChange(items.map((row) => row.id === item.id ? { ...row, probability: Number(event.target.value) } : row))} /></label><label>Color<input type="color" value={item.color} onChange={(event) => onChange(items.map((row) => row.id === item.id ? { ...row, color: event.target.value } : row))} /></label><label>Type<select value={item.type} onChange={(event) => onChange(items.map((row) => row.id === item.id ? { ...row, type: event.target.value as PipelineStageConfig["type"] } : row))}><option>active</option><option>closed</option><option>lost</option></select></label><label><input type="checkbox" checked={item.enabled} onChange={(event) => onChange(items.map((row) => row.id === item.id ? { ...row, enabled: event.target.checked } : row))} />Enabled</label>{index > 0 && <button type="button" onClick={() => { const next = [...items]; [next[index - 1], next[index]] = [next[index], next[index - 1]]; onChange(next); }}>Move Up</button>}<button type="button" onClick={() => onChange(items.filter((row) => row.id !== item.id))}><Trash2 size={15} /> Delete</button></article>)}</div>;
}

function UserSettings({ items, onChange }: { items: AdminUser[]; onChange: (items: AdminUser[]) => void }) {
  return <div className="form-list"><button type="button" onClick={() => onChange([...items, { id: uid("user"), name: "", email: "", role: "Read Only", enabled: true, permissions: ["View Leads"] }])}><Plus size={15} /> Invite User</button>{items.map((item) => <article key={item.id}><label>Name<input value={item.name} onChange={(event) => onChange(items.map((row) => row.id === item.id ? { ...row, name: event.target.value } : row))} /></label><label>Email<input value={item.email} onChange={(event) => onChange(items.map((row) => row.id === item.id ? { ...row, email: event.target.value } : row))} /></label><label>Role<select value={item.role} onChange={(event) => onChange(items.map((row) => row.id === item.id ? { ...row, role: event.target.value as AdminUser["role"] } : row))}><option>Admin</option><option>Acquisition Manager</option><option>VA</option><option>Disposition Manager</option><option>Read Only</option></select></label><label>Permissions<input value={item.permissions.join(", ")} onChange={(event) => onChange(items.map((row) => row.id === item.id ? { ...row, permissions: event.target.value.split(",").map((value) => value.trim()).filter(Boolean) } : row))} /></label><label><input type="checkbox" checked={item.enabled} onChange={(event) => onChange(items.map((row) => row.id === item.id ? { ...row, enabled: event.target.checked } : row))} />Enabled</label><button type="button" onClick={() => onChange(items.filter((row) => row.id !== item.id))}><Trash2 size={15} /> Disable/Delete</button></article>)}</div>;
}

function AttorneySettings({ settings, update }: { settings: DashboardSettings; update: (changes: Partial<DashboardSettings>) => void }) {
  const attorney = settings.attorney;
  const set = (key: keyof DashboardSettings["attorney"], value: string) => update({ attorney: { ...attorney, [key]: value } });
  return <div className="admin-form-grid wide">{Object.entries(attorney).map(([key, value]) => <label key={key}>{key.replace(/([A-Z])/g, " $1")}<textarea value={value} onChange={(event) => set(key as keyof DashboardSettings["attorney"], event.target.value)} /></label>)}</div>;
}

function PartnerSettings({ items, onChange }: { items: ClosingPartner[]; onChange: (items: ClosingPartner[]) => void }) {
  return <div className="form-list"><button type="button" onClick={() => onChange([...items, { id: uid("partner"), partnerName: "", contactName: "", email: "", phone: "", market: "", notes: "", active: true }])}><Plus size={15} /> Add Partner</button>{items.map((item) => <article key={item.id}>{(["partnerName", "contactName", "email", "phone", "market", "notes"] as const).map((key) => <label key={key}>{key}<input value={item[key]} onChange={(event) => onChange(items.map((row) => row.id === item.id ? { ...row, [key]: event.target.value } : row))} /></label>)}<label><input type="checkbox" checked={item.active} onChange={(event) => onChange(items.map((row) => row.id === item.id ? { ...row, active: event.target.checked } : row))} />Active</label><button type="button" onClick={() => onChange(items.filter((row) => row.id !== item.id))}><Trash2 size={15} /> Delete</button></article>)}</div>;
}

function MarketSettings({ items, onChange }: { items: MarketServed[]; onChange: (items: MarketServed[]) => void }) {
  return <div className="form-list"><button type="button" onClick={() => onChange([...items, { id: uid("market"), state: "NC", city: "", county: "", active: true, pageUrl: "", defaultClosingPartner: "", notes: "" }])}><Plus size={15} /> Add Market</button>{items.map((item) => <article key={item.id}>{(["state", "city", "county", "pageUrl", "defaultClosingPartner", "notes"] as const).map((key) => <label key={key}>{key}<input value={item[key]} onChange={(event) => onChange(items.map((row) => row.id === item.id ? { ...row, [key]: event.target.value } : row))} /></label>)}<label><input type="checkbox" checked={item.active} onChange={(event) => onChange(items.map((row) => row.id === item.id ? { ...row, active: event.target.checked } : row))} />Active</label><button type="button" onClick={() => onChange(items.filter((row) => row.id !== item.id))}><Trash2 size={15} /> Delete</button></article>)}</div>;
}

function HoursSettings({ settings, update }: { settings: DashboardSettings; update: (changes: Partial<DashboardSettings>) => void }) {
  const hours = settings.businessHours;
  return <div className="form-list">{hours.days.map((day) => <article key={day.day}><strong>{day.day}</strong><label><input type="checkbox" checked={day.open} onChange={(event) => update({ businessHours: { ...hours, days: hours.days.map((row) => row.day === day.day ? { ...row, open: event.target.checked } : row) } })} />Open</label><label>Open<input type="time" value={day.openTime} onChange={(event) => update({ businessHours: { ...hours, days: hours.days.map((row) => row.day === day.day ? { ...row, openTime: event.target.value } : row) } })} /></label><label>Close<input type="time" value={day.closeTime} onChange={(event) => update({ businessHours: { ...hours, days: hours.days.map((row) => row.day === day.day ? { ...row, closeTime: event.target.value } : row) } })} /></label></article>)}<label>Holiday closures<textarea value={hours.holidayClosures} onChange={(event) => update({ businessHours: { ...hours, holidayClosures: event.target.value } })} /></label><label>After-hours response<textarea value={hours.afterHoursMessage} onChange={(event) => update({ businessHours: { ...hours, afterHoursMessage: event.target.value } })} /></label></div>;
}

function LeadProfile(props: { lead: Lead; onClose: () => void; onSave: (id: string, changes: Partial<Lead>) => void }) {
  const [notes, setNotes] = useState(props.lead.adminNotes || "");
  const [tasks, setTasks] = useState((props.lead.tasks || []).join("\n"));
  const [assignedTo, setAssignedTo] = useState(props.lead.assignedTo || "Michael Cobb");
  useEffect(() => { setNotes(props.lead.adminNotes || ""); setTasks((props.lead.tasks || []).join("\n")); setAssignedTo(props.lead.assignedTo || "Michael Cobb"); }, [props.lead.id, props.lead.adminNotes, props.lead.tasks, props.lead.assignedTo]);
  return (
    <aside className="lead-profile">
      <button className="lead-profile-close" onClick={props.onClose} type="button">Close</button>
      <h2>{props.lead.name}</h2><p>{props.lead.address}</p>
      <div className="quick-action-grid"><a href={`tel:${props.lead.phone}`}><Phone size={15} /> Call</a><a href={`sms:${props.lead.phone}`}><MessageSquare size={15} /> Text</a><a href={`mailto:${props.lead.email}`}><Mail size={15} /> Email</a><button onClick={() => props.onSave(props.lead.id, { status: "Contacted", lastContactedAt: new Date().toISOString() })} type="button"><UserCheck size={15} /> Mark Contacted</button><button onClick={() => props.onSave(props.lead.id, { status: "Offer Sent" })} type="button"><FileText size={15} /> Create Offer</button><button onClick={() => props.onSave(props.lead.id, { status: "Archived" })} type="button"><Archive size={15} /> Archive</button></div>
      <dl><dt>Contact Information</dt><dd>{props.lead.phone || "-"}<br />{props.lead.email || "-"}</dd><dt>Property Information</dt><dd>{props.lead.address}<br />{props.lead.propertyCondition || "Condition not provided"}</dd><dt>Seller Situation</dt><dd>{props.lead.details || "No notes yet."}</dd><dt>Timeline</dt><dd>{props.lead.timeline || "Not specified"}</dd><dt>Activity History</dt><dd>Submitted {new Date(props.lead.submittedAt).toLocaleString()}<br />Current stage: {props.lead.status}</dd><dt>Offer Details</dt><dd>Estimated acquisition value: ${estimatedValue(props.lead).toLocaleString()}</dd><dt>Map</dt><dd><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(props.lead.address)}`} target="_blank">Open property map</a></dd></dl>
      <div className="admin-mini-form"><label>Assigned to<input value={assignedTo} onChange={(event) => setAssignedTo(event.target.value)} /></label><label>Internal notes<textarea value={notes} onChange={(event) => setNotes(event.target.value)} /></label><label>Tasks, one per line<textarea value={tasks} onChange={(event) => setTasks(event.target.value)} /></label><button className="button" type="button" onClick={() => props.onSave(props.lead.id, { adminNotes: notes, assignedTo, tasks: tasks.split("\n").map((task) => task.trim()).filter(Boolean) })}><Save size={16} /> Save Lead Details</button></div>
    </aside>
  );
}

function TestimonialsPanel(props: { reviewSources: string[]; selectedTestimonial: Partial<Testimonial>; setSelectedTestimonial: (value: Partial<Testimonial> | ((value: Partial<Testimonial>) => Partial<Testimonial>)) => void; setTestimonialTags: (value: string) => void; testimonialStatuses: string[]; testimonialTags: string; testimonials: Testimonial[]; onDelete: (id: string) => void; onQuickUpdate: (id: string, changes: Partial<Testimonial>) => void; onSave: (event: FormEvent<HTMLFormElement>) => void }) {
  return (
    <section className="admin-testimonial-grid">
      <form className="command-panel testimonial-form" onSubmit={props.onSave}>
        <h2>{props.selectedTestimonial.id ? "Edit Review" : "Add Review"}</h2>
        <div className="admin-form-grid"><label>Customer name<input value={props.selectedTestimonial.customerName || ""} onChange={(event) => props.setSelectedTestimonial((item) => ({ ...item, customerName: event.target.value }))} /></label><label>Last initial<input value={props.selectedTestimonial.lastInitial || ""} onChange={(event) => props.setSelectedTestimonial((item) => ({ ...item, lastInitial: event.target.value }))} /></label><label>City<input value={props.selectedTestimonial.city || ""} onChange={(event) => props.setSelectedTestimonial((item) => ({ ...item, city: event.target.value }))} /></label><label>State<input value={props.selectedTestimonial.state || ""} onChange={(event) => props.setSelectedTestimonial((item) => ({ ...item, state: event.target.value }))} /></label><label>Situation<input value={props.selectedTestimonial.situation || ""} onChange={(event) => props.setSelectedTestimonial((item) => ({ ...item, situation: event.target.value }))} /></label><label>Rating<input min="1" max="5" type="number" value={props.selectedTestimonial.rating || 5} onChange={(event) => props.setSelectedTestimonial((item) => ({ ...item, rating: Number(event.target.value) }))} /></label><label>Source<select value={props.selectedTestimonial.source || "Internal"} onChange={(event) => props.setSelectedTestimonial((item) => ({ ...item, source: event.target.value as Testimonial["source"] }))}>{props.reviewSources.map((source) => <option key={source}>{source}</option>)}</select></label><label>Status<select value={props.selectedTestimonial.status || "Pending"} onChange={(event) => props.setSelectedTestimonial((item) => ({ ...item, status: event.target.value as Testimonial["status"] }))}>{props.testimonialStatuses.map((status) => <option key={status}>{status}</option>)}</select></label></div>
        <label>Review text<textarea value={props.selectedTestimonial.reviewText || ""} onChange={(event) => props.setSelectedTestimonial((item) => ({ ...item, reviewText: event.target.value }))} /></label><label>Tags<input value={props.testimonialTags || (props.selectedTestimonial.tags || []).join(", ")} onChange={(event) => { props.setTestimonialTags(event.target.value); props.setSelectedTestimonial((item) => ({ ...item, tags: event.target.value.split(",").map((tag) => tag.trim()).filter(Boolean) })); }} /></label><label>Closing story highlight<textarea value={props.selectedTestimonial.storyHighlight || ""} onChange={(event) => props.setSelectedTestimonial((item) => ({ ...item, storyHighlight: event.target.value }))} /></label>
        <div className="admin-checkboxes"><label><input type="checkbox" checked={Boolean(props.selectedTestimonial.verified)} onChange={(event) => props.setSelectedTestimonial((item) => ({ ...item, verified: event.target.checked }))} />Verified</label><label><input type="checkbox" checked={Boolean(props.selectedTestimonial.featured)} onChange={(event) => props.setSelectedTestimonial((item) => ({ ...item, featured: event.target.checked }))} />Featured</label></div>
        <button className="button" type="submit"><Save size={16} /> Save Review</button>
      </form>
      <div className="command-panel admin-table-wrap"><table className="admin-table testimonial-admin-table"><thead><tr><th>Name</th><th>City</th><th>Situation</th><th>Status</th><th>Flags</th></tr></thead><tbody>{props.testimonials.length ? props.testimonials.map((testimonial) => <tr key={testimonial.id} onClick={() => { props.setSelectedTestimonial(testimonial); props.setTestimonialTags((testimonial.tags || []).join(", ")); }}><td>{testimonial.customerName} {testimonial.lastInitial}</td><td>{testimonial.city}, {testimonial.state}</td><td>{testimonial.situation}</td><td>{testimonial.status}</td><td><button className={testimonial.featured ? "flag-button active" : "flag-button"} onClick={(event) => { event.stopPropagation(); props.onQuickUpdate(testimonial.id, { featured: !testimonial.featured }); }} type="button">Featured</button><button className={testimonial.verified ? "flag-button active" : "flag-button"} onClick={(event) => { event.stopPropagation(); props.onQuickUpdate(testimonial.id, { verified: !testimonial.verified }); }} type="button">Verified</button><button className="flag-button" onClick={(event) => { event.stopPropagation(); props.onDelete(testimonial.id); }} type="button">Delete</button></td></tr>) : <tr><td colSpan={5}>No testimonials yet.</td></tr>}</tbody></table></div>
    </section>
  );
}
