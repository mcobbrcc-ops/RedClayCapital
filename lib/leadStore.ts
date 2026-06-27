import { promises as fs } from "fs";
import { randomUUID } from "crypto";

export const leadStatuses = [
  "New",
  "Contacted",
  "Property Review",
  "Offer Sent",
  "Negotiating",
  "Under Contract",
  "Title Work",
  "Closing Scheduled",
  "Closed",
  "Archived"
] as const;

export type LeadStatus = (typeof leadStatuses)[number];

export type LeadRecord = {
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
  source: string;
  status: LeadStatus;
};

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "RedClay111";
const globalStore = globalThis as typeof globalThis & {
  redClayLeadCache?: LeadRecord[];
};

function storagePath() {
  if (process.env.LEAD_STORAGE_PATH) {
    return process.env.LEAD_STORAGE_PATH;
  }

  if (process.env.VERCEL) {
    return "/tmp/redclay-leads.json";
  }

  return ".data/leads.json";
}

async function readFileLeads() {
  try {
    const raw = await fs.readFile(storagePath(), "utf8");
    return (JSON.parse(raw) as LeadRecord[]).map((lead) => ({
      ...lead,
      status: normalizeLeadStatus(lead.status)
    }));
  } catch {
    return [];
  }
}

async function writeFileLeads(leads: LeadRecord[]) {
  const file = storagePath();
  try {
    const directory = file.includes("/") ? file.slice(0, file.lastIndexOf("/")) : ".";
    await fs.mkdir(directory, { recursive: true });
    await fs.writeFile(file, JSON.stringify(leads, null, 2), "utf8");
  } catch (error) {
    console.error("Lead file storage unavailable; using in-memory cache.", error);
  }
}

export function verifyAdminPassword(password: string | null | undefined) {
  return password === ADMIN_PASSWORD;
}

export function normalizeLeadStatus(status: string | null | undefined): LeadStatus {
  if (status === "Offer Made") return "Offer Sent";
  if (status === "Follow Up") return "Negotiating";
  if (leadStatuses.includes(status as LeadStatus)) return status as LeadStatus;
  return "New";
}

export async function getLeads() {
  if (!globalStore.redClayLeadCache) {
    globalStore.redClayLeadCache = await readFileLeads();
  }

  return [...globalStore.redClayLeadCache].sort((a, b) =>
    b.submittedAt.localeCompare(a.submittedAt)
  );
}

export async function saveLead(lead: Omit<LeadRecord, "id" | "status">) {
  const leads = await getLeads();
  const record: LeadRecord = {
    ...lead,
    id: randomUUID(),
    status: "New"
  };

  globalStore.redClayLeadCache = [record, ...leads];
  await writeFileLeads(globalStore.redClayLeadCache);
  return record;
}

export async function updateLeadStatus(id: string, status: LeadStatus) {
  const normalizedStatus = normalizeLeadStatus(status);
  if (!leadStatuses.includes(normalizedStatus)) {
    throw new Error("Invalid lead status");
  }

  const leads = await getLeads();
  const next = leads.map((lead) => (lead.id === id ? { ...lead, status: normalizedStatus } : lead));
  globalStore.redClayLeadCache = next;
  await writeFileLeads(next);
  return next.find((lead) => lead.id === id) || null;
}

export function filterLeads(
  leads: LeadRecord[],
  options: { search?: string; from?: string; to?: string }
) {
  const search = options.search?.trim().toLowerCase();
  const from = options.from ? new Date(`${options.from}T00:00:00`).toISOString() : "";
  const to = options.to ? new Date(`${options.to}T23:59:59`).toISOString() : "";

  return leads.filter((lead) => {
    const haystack = [
      lead.name,
      lead.phone,
      lead.email,
      lead.address,
      lead.details,
      lead.propertyCondition,
      lead.timeline,
      lead.status
    ]
      .join(" ")
      .toLowerCase();

    if (search && !haystack.includes(search)) {
      return false;
    }

    if (from && lead.submittedAt < from) {
      return false;
    }

    if (to && lead.submittedAt > to) {
      return false;
    }

    return true;
  });
}

export function leadsToCsv(leads: LeadRecord[]) {
  const headers = [
    "Submitted At",
    "Status",
    "Name",
    "Phone",
    "Email",
    "Property Address",
    "Property Condition",
    "Timeline",
    "Message",
    "Source Page",
    "UTM Parameters"
  ];

  const escape = (value: unknown) => {
    const text =
      typeof value === "string" ? value : JSON.stringify(value ?? "");
    return `"${text.replace(/"/g, '""')}"`;
  };

  const rows = leads.map((lead) => [
    lead.submittedAt,
    lead.status,
    lead.name,
    lead.phone,
    lead.email,
    lead.address,
    lead.propertyCondition,
    lead.timeline,
    lead.details,
    lead.sourcePage,
    lead.utmParams
  ]);

  return [headers, ...rows].map((row) => row.map(escape).join(",")).join("\n");
}
