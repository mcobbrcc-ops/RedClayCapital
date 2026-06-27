import { NextRequest, NextResponse } from "next/server";
import { addAdminNotification } from "@/lib/adminStore";
import { saveLead } from "@/lib/leadStore";

type LeadPayload = {
  address?: string;
  name?: string;
  phone?: string;
  email?: string;
  propertyCondition?: string;
  timeline?: string;
  details?: string;
  sourcePage?: string;
  utmParams?: Record<string, string>;
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
    propertyCondition: clean(body.propertyCondition),
    timeline: clean(body.timeline),
    details: clean(body.details),
    sourcePage: clean(body.sourcePage) || request.headers.get("referer") || "/",
    utmParams: body.utmParams && typeof body.utmParams === "object" ? body.utmParams : {},
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
  const savedLead = await saveLead(lead);
  await addAdminNotification({
    type: "Lead",
    title: `New lead: ${savedLead.name}`,
    message: `${savedLead.address} - ${savedLead.phone || savedLead.email}`,
    leadId: savedLead.id
  });

  if (!webhookUrl) {
    return NextResponse.json({ ok: true, leadId: savedLead.id, webhook: "not_configured" });
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.LEAD_CAPTURE_WEBHOOK_SECRET
          ? { Authorization: `Bearer ${process.env.LEAD_CAPTURE_WEBHOOK_SECRET}` }
          : {})
      },
      body: JSON.stringify(savedLead)
    });

    if (!response.ok) {
      console.error("Lead webhook failed", response.status);
      return NextResponse.json({ ok: true, leadId: savedLead.id, webhook: "failed" });
    }
  } catch (error) {
    console.error("Lead webhook error", error);
    return NextResponse.json({ ok: true, leadId: savedLead.id, webhook: "failed" });
  }

  return NextResponse.json({ ok: true, leadId: savedLead.id, webhook: "sent" });
}
