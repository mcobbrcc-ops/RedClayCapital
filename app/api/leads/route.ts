import { NextRequest, NextResponse } from "next/server";

type LeadPayload = {
  address?: string;
  name?: string;
  phone?: string;
  email?: string;
  details?: string;
};

function clean(value: unknown) {
  return typeof value === "string" ? value.trim().slice(0, 2000) : "";
}

export async function POST(request: NextRequest) {
  let body: LeadPayload;

  try {
    body = (await request.json()) as LeadPayload;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const lead = {
    address: clean(body.address),
    name: clean(body.name),
    phone: clean(body.phone),
    email: clean(body.email),
    details: clean(body.details),
    source: "redclaycap.com",
    submittedAt: new Date().toISOString()
  };

  if (!lead.address || !lead.name || (!lead.phone && !lead.email)) {
    return NextResponse.json(
      { error: "Address, name, and phone or email are required" },
      { status: 400 }
    );
  }

  const webhookUrl = process.env.LEAD_CAPTURE_WEBHOOK_URL;

  if (!webhookUrl) {
    if (process.env.NODE_ENV !== "production") {
      console.info("Lead captured locally:", lead);
      return NextResponse.json({ ok: true, mode: "development" });
    }

    return NextResponse.json(
      { error: "Lead capture is not configured" },
      { status: 503 }
    );
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(process.env.LEAD_CAPTURE_WEBHOOK_SECRET
        ? { Authorization: `Bearer ${process.env.LEAD_CAPTURE_WEBHOOK_SECRET}` }
        : {})
    },
    body: JSON.stringify(lead)
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: "Lead capture service failed" },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
