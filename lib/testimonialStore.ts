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
  source: "Seller Feedback" | "Internal" | "Google" | "Facebook" | "Zillow";
  status: TestimonialStatus;
  storyHighlight?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
};

const now = "2026-06-26T00:00:00.000Z";

export const productionTestimonials: TestimonialRecord[] = [
  {
    id: "seller-feedback-transparent-pricing",
    customerName: "Homeowner",
    city: "North Carolina",
    state: "",
    situation: "Transparent Pricing",
    rating: 5,
    reviewText:
      "Red Clay Capital was patient from the first conversation. Other companies gave us numbers that sounded good at first but never explained how they got there. Michael walked us through where he could honestly be, explained why, and followed through exactly like he said he would.",
    verified: true,
    closingDate: "",
    featured: true,
    source: "Seller Feedback",
    status: "Approved",
    storyHighlight: "Patient communication and a clear explanation of the offer helped the seller understand exactly where the numbers came from.",
    tags: ["Transparency", "Fair Offer"],
    createdAt: now,
    updatedAt: now
  },
  {
    id: "seller-feedback-fast-closing",
    customerName: "Property Seller",
    city: "North Carolina",
    state: "",
    situation: "Fast Closing",
    rating: 5,
    reviewText:
      "We had already talked to a few buyers before Red Clay Capital, and honestly, most of them wasted our time. Red Clay did not try to tell us what we wanted to hear. They gave us a fair number, explained the process clearly, and got it done faster than expected.",
    verified: true,
    closingDate: "",
    featured: true,
    source: "Seller Feedback",
    status: "Approved",
    storyHighlight: "After other buyers wasted time, Red Clay Capital gave the seller clarity, a realistic number, and a faster-than-expected closing.",
    tags: ["Fair Offer", "Fast Closing"],
    createdAt: now,
    updatedAt: now
  },
  {
    id: "seller-feedback-no-pressure",
    customerName: "Seller",
    city: "North Carolina",
    state: "",
    situation: "No Pressure Sale",
    rating: 5,
    reviewText:
      "The biggest difference was the transparency. They did not pressure us, did not overpromise, and did not change the number at the last minute. Everything was explained up front, and the closing happened earlier than we agreed.",
    verified: true,
    closingDate: "",
    featured: true,
    source: "Seller Feedback",
    status: "Approved",
    storyHighlight: "A clear offer, no last-minute renegotiation, and an early closing created the kind of confidence sellers need.",
    tags: ["Transparency", "Fast Closing", "Stress-Free Process"],
    createdAt: now,
    updatedAt: now
  },
  {
    id: "seller-feedback-raleigh-stressful-situation",
    customerName: "Homeowner",
    city: "Raleigh Area",
    state: "",
    situation: "Stressful Situation",
    rating: 5,
    reviewText:
      "Our situation was stressful, and we needed someone who would actually listen. Red Clay Capital took the time to understand what was going on, helped us look at our options, and made the sale simple.",
    verified: true,
    closingDate: "",
    featured: false,
    source: "Seller Feedback",
    status: "Approved",
    storyHighlight: "The seller needed a patient listener and a simple path forward instead of another high-pressure sales pitch.",
    tags: ["Stress-Free Process", "Problem Property"],
    createdAt: now,
    updatedAt: now
  },
  {
    id: "seller-feedback-eastern-nc-honest-offer",
    customerName: "Homeowner",
    city: "Eastern North Carolina",
    state: "",
    situation: "Honest Offer",
    rating: 5,
    reviewText:
      "I appreciated that they were honest about what they could do. They did not come in with a fake high offer and then renegotiate later. They told us where they could perform, explained the numbers, and delivered.",
    verified: true,
    closingDate: "",
    featured: false,
    source: "Seller Feedback",
    status: "Approved",
    storyHighlight: "The seller valued an honest number that Red Clay Capital could actually stand behind and close on.",
    tags: ["Fair Offer", "Transparency"],
    createdAt: now,
    updatedAt: now
  },
  {
    id: "seller-feedback-worked-hard",
    customerName: "Property Owner",
    city: "North Carolina",
    state: "",
    situation: "Problem Property",
    rating: 5,
    reviewText:
      "They worked hard to make the deal happen. We had some things that needed to be figured out, and Red Clay stayed patient, communicated clearly, and helped us get to the closing table.",
    verified: true,
    closingDate: "",
    featured: false,
    source: "Seller Feedback",
    status: "Approved",
    storyHighlight: "A more complicated sale required patience, steady communication, and follow-through all the way to closing.",
    tags: ["Problem Property", "Stress-Free Process"],
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

function mergeSeededTestimonials(saved: TestimonialRecord[]) {
  const savedById = new Map(saved.map((testimonial) => [testimonial.id, testimonial]));
  const seeded = productionTestimonials.map((testimonial) => savedById.get(testimonial.id) || testimonial);
  const custom = saved.filter(
    (testimonial) =>
      !productionTestimonials.some((seed) => seed.id === testimonial.id) &&
      !testimonial.id.startsWith("placeholder-")
  );

  return [...seeded, ...custom];
}

export async function getTestimonials() {
  if (!globalStore.redClayTestimonialCache) {
    globalStore.redClayTestimonialCache = mergeSeededTestimonials(await readFileTestimonials());
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
    tags: Array.isArray(input.tags) ? input.tags.map(clean).filter(Boolean) : existing?.tags || [],
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
  options: { search?: string; situation?: string; city?: string; tag?: string }
) {
  const search = options.search?.trim().toLowerCase();
  const situation = options.situation?.trim().toLowerCase();
  const city = options.city?.trim().toLowerCase();
  const tag = options.tag?.trim().toLowerCase();

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
      testimonial.status,
      ...(testimonial.tags || [])
    ]
      .join(" ")
      .toLowerCase();

    if (search && !haystack.includes(search)) return false;
    if (situation && testimonial.situation.toLowerCase() !== situation) return false;
    if (city && testimonial.city.toLowerCase() !== city) return false;
    if (tag && !(testimonial.tags || []).some((item) => item.toLowerCase() === tag)) return false;
    return true;
  });
}

export { verifyAdminPassword };
