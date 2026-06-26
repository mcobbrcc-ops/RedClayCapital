import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import { verifyAdminPassword } from "./leadStore";

export const testimonialStatuses = ["Pending", "Approved", "Hidden"] as const;
export type TestimonialStatus = (typeof testimonialStatuses)[number];

export type TestimonialRecord = {
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
  source: "Placeholder" | "Internal" | "Google" | "Facebook" | "Zillow";
  status: TestimonialStatus;
  storyHighlight?: string;
  videoPlaceholder?: boolean;
  createdAt: string;
  updatedAt: string;
};

const now = "2026-06-26T00:00:00.000Z";

export const placeholderTestimonials: TestimonialRecord[] = [
  {
    id: "placeholder-inherited-raleigh",
    customerName: "Sarah",
    lastInitial: "M.",
    city: "Raleigh",
    state: "NC",
    situation: "Inherited Property",
    rating: 5,
    reviewText:
      "We spoke with several companies before calling Red Clay Capital, and they were the first people who actually listened instead of immediately throwing out a number. They explained how they valued the property, answered every question we had, and never pressured us. We ended up closing sooner than expected, and the process was incredibly smooth.",
    verified: false,
    closingDate: "",
    featured: true,
    source: "Placeholder",
    status: "Approved",
    storyHighlight: "A family needed a calmer path after inheriting a house and comparing several cash buyer options.",
    videoPlaceholder: true,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "placeholder-tenants-durham",
    customerName: "James",
    lastInitial: "R.",
    city: "Durham",
    state: "NC",
    situation: "Problem Tenants",
    rating: 5,
    reviewText:
      "Our rental property had become more stressful than it was worth. We had non-paying tenants and did not know where to turn. Red Clay Capital walked us through every option and never made us feel rushed. They gave us a fair offer and handled everything professionally.",
    verified: false,
    closingDate: "",
    featured: true,
    source: "Placeholder",
    status: "Approved",
    storyHighlight: "A rental owner wanted a respectful way to move on from a property that had become difficult to manage.",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "placeholder-fire-goldsboro",
    customerName: "Melissa",
    lastInitial: "T.",
    city: "Goldsboro",
    state: "NC",
    situation: "Fire Damage",
    rating: 5,
    reviewText:
      "We thought we were stuck after the fire. Other investors promised unrealistic numbers just to get us interested, then changed everything later. Red Clay Capital explained exactly what they could do from the beginning, kept every promise, and actually closed earlier than they originally estimated.",
    verified: false,
    closingDate: "",
    featured: true,
    source: "Placeholder",
    status: "Approved",
    storyHighlight: "A damaged property required direct communication and a realistic closing plan.",
    videoPlaceholder: true,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "placeholder-repairs-cary",
    customerName: "Daniel",
    lastInitial: "H.",
    city: "Cary",
    state: "NC",
    situation: "Major Repairs",
    rating: 5,
    reviewText:
      "We could not afford to repair the house, and we did not want to list it. The process was simple, honest, and stress-free. Every question was answered, and there were absolutely no surprises.",
    verified: false,
    closingDate: "",
    featured: false,
    source: "Placeholder",
    status: "Approved",
    storyHighlight: "A repair-heavy property needed an as-is option without listing prep.",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "placeholder-foreclosure-fayetteville",
    customerName: "Anthony",
    lastInitial: "P.",
    city: "Fayetteville",
    state: "NC",
    situation: "Foreclosure",
    rating: 5,
    reviewText:
      "They treated us with dignity during one of the hardest times in our lives. There was never any pressure. Just honest conversations and real solutions.",
    verified: false,
    closingDate: "",
    featured: false,
    source: "Placeholder",
    status: "Approved",
    storyHighlight: "A time-sensitive sale called for privacy, dignity, and steady communication.",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "placeholder-probate-wilmington",
    customerName: "Jennifer",
    lastInitial: "L.",
    city: "Wilmington",
    state: "NC",
    situation: "Probate",
    rating: 5,
    reviewText:
      "Everything felt overwhelming until we contacted Red Clay Capital. They coordinated with the attorney, explained every step, and made an emotional situation much easier than we expected.",
    verified: false,
    closingDate: "",
    featured: false,
    source: "Placeholder",
    status: "Approved",
    storyHighlight: "A probate property needed careful coordination and plain-English guidance.",
    createdAt: now,
    updatedAt: now
  }
];

const globalStore = globalThis as typeof globalThis & {
  redClayTestimonialCache?: TestimonialRecord[];
};

function storagePath() {
  if (process.env.TESTIMONIAL_STORAGE_PATH) {
    return process.env.TESTIMONIAL_STORAGE_PATH;
  }

  if (process.env.VERCEL) {
    return "/tmp/redclay-testimonials.json";
  }

  return ".data/testimonials.json";
}

async function readFileTestimonials() {
  try {
    const raw = await fs.readFile(storagePath(), "utf8");
    return JSON.parse(raw) as TestimonialRecord[];
  } catch {
    return [];
  }
}

async function writeFileTestimonials(testimonials: TestimonialRecord[]) {
  const file = storagePath();
  try {
    const directory = file.includes("/") ? file.slice(0, file.lastIndexOf("/")) : ".";
    await fs.mkdir(directory, { recursive: true });
    await fs.writeFile(file, JSON.stringify(testimonials, null, 2), "utf8");
  } catch (error) {
    console.error("Testimonial file storage unavailable; using in-memory cache.", error);
  }
}

function normalizeRating(value: unknown) {
  const rating = Number(value);
  if (!Number.isFinite(rating)) {
    return 5;
  }
  return Math.max(1, Math.min(5, Math.round(rating)));
}

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function getTestimonials() {
  if (!globalStore.redClayTestimonialCache) {
    const saved = await readFileTestimonials();
    globalStore.redClayTestimonialCache = saved.length ? saved : placeholderTestimonials;
  }

  return [...globalStore.redClayTestimonialCache].sort((a, b) =>
    Number(b.featured) - Number(a.featured) || b.updatedAt.localeCompare(a.updatedAt)
  );
}

export async function getPublicTestimonials() {
  const testimonials = await getTestimonials();
  return testimonials.filter((testimonial) => testimonial.status === "Approved");
}

export async function saveTestimonial(
  input: Partial<TestimonialRecord>,
  options: { id?: string } = {}
) {
  const testimonials = await getTestimonials();
  const timestamp = new Date().toISOString();
  const existing = options.id ? testimonials.find((item) => item.id === options.id) : null;
  const status = testimonialStatuses.includes(input.status as TestimonialStatus)
    ? (input.status as TestimonialStatus)
    : existing?.status || "Pending";

  const record: TestimonialRecord = {
    id: existing?.id || randomUUID(),
    customerName: clean(input.customerName) || existing?.customerName || "",
    lastInitial: clean(input.lastInitial) || existing?.lastInitial || "",
    city: clean(input.city) || existing?.city || "",
    state: clean(input.state) || existing?.state || "NC",
    situation: clean(input.situation) || existing?.situation || "Home Sale",
    rating: normalizeRating(input.rating ?? existing?.rating),
    reviewText: clean(input.reviewText) || existing?.reviewText || "",
    photoUrl: clean(input.photoUrl) || existing?.photoUrl || "",
    verified: Boolean(input.verified ?? existing?.verified),
    closingDate: clean(input.closingDate) || existing?.closingDate || "",
    featured: Boolean(input.featured ?? existing?.featured),
    source: input.source || existing?.source || "Internal",
    status,
    storyHighlight: clean(input.storyHighlight) || existing?.storyHighlight || "",
    videoPlaceholder: Boolean(input.videoPlaceholder ?? existing?.videoPlaceholder),
    createdAt: existing?.createdAt || timestamp,
    updatedAt: timestamp
  };

  if (!record.customerName || !record.city || !record.reviewText) {
    throw new Error("Customer name, city, and review text are required");
  }

  const next = existing
    ? testimonials.map((item) => (item.id === existing.id ? record : item))
    : [record, ...testimonials];

  globalStore.redClayTestimonialCache = next;
  await writeFileTestimonials(next);
  return record;
}

export async function updateTestimonial(id: string, input: Partial<TestimonialRecord>) {
  return saveTestimonial(input, { id });
}

export function filterTestimonials(
  testimonials: TestimonialRecord[],
  options: { search?: string; situation?: string; city?: string }
) {
  const search = options.search?.trim().toLowerCase();
  const situation = options.situation?.trim().toLowerCase();
  const city = options.city?.trim().toLowerCase();

  return testimonials.filter((testimonial) => {
    const haystack = [
      testimonial.customerName,
      testimonial.lastInitial,
      testimonial.city,
      testimonial.state,
      testimonial.situation,
      testimonial.reviewText,
      testimonial.storyHighlight,
      testimonial.source,
      testimonial.status
    ]
      .join(" ")
      .toLowerCase();

    if (search && !haystack.includes(search)) return false;
    if (situation && testimonial.situation.toLowerCase() !== situation) return false;
    if (city && testimonial.city.toLowerCase() !== city) return false;
    return true;
  });
}

export { verifyAdminPassword };
