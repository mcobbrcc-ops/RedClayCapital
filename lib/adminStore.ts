import { randomUUID } from "crypto";
import { promises as fs } from "fs";

export type Template = {
  id: string;
  name: string;
  subject?: string;
  body: string;
};

export type NotificationRule = {
  id: string;
  name: string;
  enabled: boolean;
  timingMinutes: number;
  channels: {
    inApp: boolean;
    email: boolean;
    sms: boolean;
  };
  recipients: string;
};

export type OfferStatus = {
  id: string;
  name: string;
  color: string;
  enabled: boolean;
};

export type PipelineStageConfig = {
  id: string;
  name: string;
  color: string;
  probability: number;
  type: "active" | "closed" | "lost";
  enabled: boolean;
};

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Acquisition Manager" | "VA" | "Disposition Manager" | "Read Only";
  enabled: boolean;
  permissions: string[];
};

export type AttorneyInfo = {
  attorneyName: string;
  lawFirm: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
  marketsServed: string;
};

export type ClosingPartner = {
  id: string;
  partnerName: string;
  contactName: string;
  email: string;
  phone: string;
  market: string;
  notes: string;
  active: boolean;
};

export type MarketServed = {
  id: string;
  state: string;
  city: string;
  county: string;
  active: boolean;
  pageUrl: string;
  defaultClosingPartner: string;
  notes: string;
};

export type BusinessHoursDay = {
  day: string;
  open: boolean;
  openTime: string;
  closeTime: string;
};

export type DashboardSettings = {
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
  attorney: AttorneyInfo;
  closingPartners: ClosingPartner[];
  marketsServed: MarketServed[];
  businessHours: {
    days: BusinessHoursDay[];
    holidayClosures: string;
    afterHoursMessage: string;
  };
};

export type AdminEvent = {
  id: string;
  title: string;
  date: string;
  type: "Follow-up" | "Appointment" | "Closing" | "Deadline";
  leadId?: string;
  leadName?: string;
  notes?: string;
};

export type AdminNotification = {
  id: string;
  createdAt: string;
  type: "Lead" | "Task" | "Closing" | "Offer" | "Testimonial" | "System";
  title: string;
  message: string;
  read: boolean;
  leadId?: string;
};

const defaultVariables = "{{seller_name}}, {{property_address}}, {{offer_amount}}, {{closing_date}}, {{admin_name}}, {{business_phone}}, {{business_email}}";

export const defaultSettings: DashboardSettings = {
  business: {
    businessName: "Red Clay Capital, LLC",
    websiteUrl: "https://redclaycap.com",
    mainPhone: "(888) 626-3213",
    mainEmail: "offers@redclaycap.com",
    businessAddress: "North Carolina",
    logoUrl: "/icon.svg",
    primaryColor: "#9f321f",
    accentColor: "#c8a15a",
    defaultMarket: "Raleigh, NC",
    companyDescription: "Red Clay Capital helps North Carolina homeowners sell properties as-is with a clear cash offer and a closing timeline that fits their situation.",
    footerDisclaimer: "Red Clay Capital, LLC is a private real estate investment company. Offer terms vary by property condition, title, and local market factors."
  },
  emailTemplates: [
    { id: "new-lead-admin", name: "New lead notification to admin", subject: "New seller lead: {{seller_name}}", body: `New lead received.\n\nSeller: {{seller_name}}\nProperty: {{property_address}}\nPhone: {{business_phone}}\n\nVariables: ${defaultVariables}` },
    { id: "homeowner-confirmation", name: "Homeowner confirmation email", subject: "We received your property information", body: "Hi {{seller_name}},\n\nThanks for contacting Red Clay Capital. We are reviewing {{property_address}} and will follow up soon.\n\n{{admin_name}}\n{{business_phone}}" },
    { id: "follow-up", name: "Follow-up email", subject: "Following up on {{property_address}}", body: "Hi {{seller_name}},\n\nI wanted to follow up on your property at {{property_address}}. Reply here or call {{business_phone}} when you have a moment." },
    { id: "offer-sent", name: "Offer sent email", subject: "Your Red Clay Capital offer", body: "Hi {{seller_name}},\n\nYour no-obligation offer for {{property_address}} is {{offer_amount}}. We can close around {{closing_date}} if that works for you." },
    { id: "appointment-confirmation", name: "Appointment confirmation", subject: "Appointment confirmed", body: "Hi {{seller_name}},\n\nThis confirms our appointment for {{property_address}}. Call {{business_phone}} with any questions." },
    { id: "closing-reminder", name: "Closing reminder", subject: "Closing reminder for {{property_address}}", body: "Hi {{seller_name}},\n\nYour closing is scheduled for {{closing_date}}. We will keep you updated as title work is finalized." },
    { id: "review-request", name: "Review request after closing", subject: "How did we do?", body: "Hi {{seller_name}},\n\nThank you for trusting Red Clay Capital. If the process helped, we would appreciate a short review." }
  ],
  smsTemplates: [
    { id: "sms-new-lead", name: "New lead acknowledgment", body: "Hi {{seller_name}}, Red Clay Capital received your info for {{property_address}}. We will follow up shortly. {{business_phone}}" },
    { id: "sms-follow-up", name: "Follow-up reminder", body: "Hi {{seller_name}}, just following up on {{property_address}}. Call or text us at {{business_phone}}." },
    { id: "sms-appointment", name: "Appointment confirmation", body: "Confirmed: Red Clay Capital appointment for {{property_address}}. Questions? {{business_phone}}" },
    { id: "sms-offer-follow-up", name: "Offer follow-up", body: "Hi {{seller_name}}, checking in on the offer for {{property_address}}. Happy to answer questions." },
    { id: "sms-closing", name: "Closing reminder", body: "Reminder: closing for {{property_address}} is scheduled for {{closing_date}}." }
  ],
  notificationRules: [
    { id: "new-lead", name: "New lead notification", enabled: true, timingMinutes: 0, channels: { inApp: true, email: true, sms: false }, recipients: "Admin" },
    { id: "not-contacted", name: "Lead not contacted", enabled: true, timingMinutes: 30, channels: { inApp: true, email: true, sms: true }, recipients: "Acquisition Manager" },
    { id: "task-overdue", name: "Task overdue", enabled: true, timingMinutes: 60, channels: { inApp: true, email: false, sms: false }, recipients: "Assigned user" },
    { id: "closing-approaching", name: "Closing approaching", enabled: true, timingMinutes: 1440, channels: { inApp: true, email: true, sms: false }, recipients: "Admin" },
    { id: "offer-follow-up", name: "Offer follow-up due", enabled: true, timingMinutes: 2880, channels: { inApp: true, email: true, sms: false }, recipients: "Acquisition Manager" },
    { id: "testimonial-submitted", name: "New testimonial submitted", enabled: true, timingMinutes: 0, channels: { inApp: true, email: true, sms: false }, recipients: "Admin" }
  ],
  offerStatuses: ["Draft", "Reviewing", "Sent", "Negotiating", "Accepted", "Rejected", "Expired", "Withdrawn"].map((name, index) => ({
    id: name.toLowerCase().replace(/\s+/g, "-"),
    name,
    color: ["#64748b", "#0f766e", "#9f321f", "#c8a15a", "#15803d", "#b91c1c", "#92400e", "#475569"][index],
    enabled: true
  })),
  pipelineStages: ["New", "Contacted", "Property Review", "Offer Sent", "Negotiating", "Under Contract", "Title Work", "Closing Scheduled", "Closed", "Lost"].map((name, index) => ({
    id: name.toLowerCase().replace(/\s+/g, "-"),
    name,
    color: ["#64748b", "#0f766e", "#2563eb", "#9f321f", "#c8a15a", "#7c3aed", "#0891b2", "#15803d", "#166534", "#991b1b"][index],
    probability: [5, 15, 30, 45, 55, 70, 82, 92, 100, 0][index],
    type: name === "Closed" ? "closed" : name === "Lost" ? "lost" : "active",
    enabled: true
  })),
  users: [
    { id: "owner", name: "Michael Cobb", email: "admin@redclaycap.com", role: "Admin", enabled: true, permissions: ["All"] }
  ],
  attorney: {
    attorneyName: "",
    lawFirm: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
    marketsServed: "North Carolina"
  },
  closingPartners: [],
  marketsServed: [
    { id: "raleigh-nc", state: "NC", city: "Raleigh", county: "Wake", active: true, pageUrl: "/areas-we-serve/raleigh-nc", defaultClosingPartner: "", notes: "" },
    { id: "durham-nc", state: "NC", city: "Durham", county: "Durham", active: true, pageUrl: "/areas-we-serve/durham-nc", defaultClosingPartner: "", notes: "" }
  ],
  businessHours: {
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day, index) => ({
      day,
      open: index < 6,
      openTime: "08:00",
      closeTime: index < 5 ? "18:00" : "14:00"
    })),
    holidayClosures: "",
    afterHoursMessage: "Thanks for reaching out. We received your message and will follow up during business hours."
  }
};

const globalStore = globalThis as typeof globalThis & {
  redClaySettingsCache?: DashboardSettings;
  redClayEventsCache?: AdminEvent[];
  redClayNotificationsCache?: AdminNotification[];
};

function storagePath(name: string) {
  const envName = `ADMIN_${name.toUpperCase()}_PATH`;
  if (process.env[envName]) return process.env[envName] as string;
  if (process.env.VERCEL) return `/tmp/redclay-${name}.json`;
  return `.data/${name}.json`;
}

async function readJson<T>(name: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(storagePath(name), "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJson<T>(name: string, data: T) {
  const file = storagePath(name);
  const directory = file.includes("/") ? file.slice(0, file.lastIndexOf("/")) : ".";
  await fs.mkdir(directory, { recursive: true });
  await fs.writeFile(file, JSON.stringify(data, null, 2), "utf8");
}

export async function getDashboardSettings() {
  if (!globalStore.redClaySettingsCache) {
    const saved = await readJson<Partial<DashboardSettings>>("settings", {});
    globalStore.redClaySettingsCache = {
      ...defaultSettings,
      ...saved,
      business: { ...defaultSettings.business, ...saved.business },
      businessHours: { ...defaultSettings.businessHours, ...saved.businessHours }
    };
  }
  return structuredClone(globalStore.redClaySettingsCache);
}

export async function saveDashboardSettings(settings: DashboardSettings) {
  globalStore.redClaySettingsCache = settings;
  await writeJson("settings", settings);
  return structuredClone(settings);
}

export async function getAdminEvents() {
  if (!globalStore.redClayEventsCache) {
    globalStore.redClayEventsCache = await readJson<AdminEvent[]>("events", []);
  }
  return [...globalStore.redClayEventsCache].sort((a, b) => a.date.localeCompare(b.date));
}

export async function saveAdminEvent(input: Partial<AdminEvent>) {
  const events = await getAdminEvents();
  const record: AdminEvent = {
    id: input.id || randomUUID(),
    title: String(input.title || "").trim(),
    date: input.date || new Date().toISOString().slice(0, 10),
    type: input.type || "Follow-up",
    leadId: input.leadId || "",
    leadName: input.leadName || "",
    notes: input.notes || ""
  };
  if (!record.title) throw new Error("Event title is required");
  const next = input.id ? events.map((event) => (event.id === input.id ? record : event)) : [...events, record];
  globalStore.redClayEventsCache = next;
  await writeJson("events", next);
  return record;
}

export async function deleteAdminEvent(id: string) {
  const events = await getAdminEvents();
  const next = events.filter((event) => event.id !== id);
  globalStore.redClayEventsCache = next;
  await writeJson("events", next);
}

export async function getAdminNotifications() {
  if (!globalStore.redClayNotificationsCache) {
    globalStore.redClayNotificationsCache = await readJson<AdminNotification[]>("notifications", []);
  }
  return [...globalStore.redClayNotificationsCache].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function addAdminNotification(input: Omit<AdminNotification, "id" | "createdAt" | "read">) {
  const notifications = await getAdminNotifications();
  const record: AdminNotification = {
    ...input,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    read: false
  };
  const next = [record, ...notifications];
  globalStore.redClayNotificationsCache = next;
  await writeJson("notifications", next);
  return record;
}

export async function updateAdminNotification(id: string, changes: Partial<AdminNotification>) {
  const notifications = await getAdminNotifications();
  const next = notifications.map((notification) => (notification.id === id ? { ...notification, ...changes } : notification));
  globalStore.redClayNotificationsCache = next;
  await writeJson("notifications", next);
  return next.find((notification) => notification.id === id) || null;
}

export async function deleteAdminNotification(id: string) {
  const notifications = await getAdminNotifications();
  const next = notifications.filter((notification) => notification.id !== id);
  globalStore.redClayNotificationsCache = next;
  await writeJson("notifications", next);
}
