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

const statuses = ["New", "Contacted", "Offer Made", "Follow Up", "Closed", "Archived"];

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [search, setSearch] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [message, setMessage] = useState("");

  const query = useMemo(() => {
    const params = new URLSearchParams({ password });
    if (search) params.set("search", search);
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    return params.toString();
  }, [from, password, search, to]);

  async function loadLeads() {
    const response = await fetch(`/api/admin/leads?${query}`);

    if (!response.ok) {
      setMessage("Incorrect password or unable to load leads.");
      setAuthed(false);
      return;
    }

    const data = (await response.json()) as { leads: Lead[] };
    setLeads(data.leads);
    setAuthed(true);
    setMessage("");
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await loadLeads();
  }

  async function updateStatus(id: string, status: string) {
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

  function exportCsv() {
    window.location.href = `/api/admin/leads?${query}&format=csv`;
  }

  return (
    <main className="admin-page">
      <section className="admin-shell">
        <div className="admin-header">
          <div>
            <p className="eyebrow">Red Clay Capital</p>
            <h1>Lead Admin</h1>
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
            <button className="button" type="submit">View Leads</button>
            {message && <p className="admin-message">{message}</p>}
          </form>
        ) : (
          <>
            <div className="admin-toolbar">
              <label>
                <Search size={16} aria-hidden="true" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search leads"
                />
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
                            onChange={(event) => updateStatus(lead.id, event.target.value)}
                          >
                            {statuses.map((status) => (
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
        )}
      </section>
    </main>
  );
}
