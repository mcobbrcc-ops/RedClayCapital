import { NextResponse } from "next/server";
import {
  filterTestimonials,
  getTestimonials,
  saveTestimonial,
  testimonialStatuses,
  updateTestimonial,
  verifyAdminPassword
} from "@/lib/testimonialStore";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  if (!verifyAdminPassword(searchParams.get("password"))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const testimonials = filterTestimonials(await getTestimonials(), {
    search: searchParams.get("search") || "",
    situation: searchParams.get("situation") || "",
    city: searchParams.get("city") || ""
  });

  return NextResponse.json({ testimonials });
}

export async function POST(request: Request) {
  const body = await request.json();

  if (!verifyAdminPassword(body.password)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const testimonial = await saveTestimonial(body);
    return NextResponse.json({ testimonial });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to save testimonial" },
      { status: 400 }
    );
  }
}

export async function PATCH(request: Request) {
  const body = await request.json();

  if (!verifyAdminPassword(body.password)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!body.id) {
    return NextResponse.json({ error: "Testimonial id is required" }, { status: 400 });
  }

  if (body.status && !testimonialStatuses.includes(body.status)) {
    return NextResponse.json({ error: "Invalid testimonial status" }, { status: 400 });
  }

  try {
    const testimonial = await updateTestimonial(body.id, body);
    return NextResponse.json({ testimonial });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to update testimonial" },
      { status: 400 }
    );
  }
}
