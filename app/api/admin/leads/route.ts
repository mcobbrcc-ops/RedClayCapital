import { NextRequest, NextResponse } from "next/server";
import {
  filterLeads,
  getLeads,
  leadsToCsv,
  LeadStatus,
  updateLead,
  updateLeadStatus,
  verifyAdminPassword
} from "@/lib/leadStore";

export const runtime = "nodejs";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  if (!verifyAdminPassword(searchParams.get("password"))) {
    return unauthorized();
  }

  const leads = filterLeads(await getLeads(), {
    search: searchParams.get("search") || "",
    from: searchParams.get("from") || "",
    to: searchParams.get("to") || ""
  });

  if (searchParams.get("format") === "csv") {
    return new NextResponse(leadsToCsv(leads), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": "attachment; filename=red-clay-leads.csv"
      }
    });
  }

  return NextResponse.json({ leads });
}

export async function PATCH(request: NextRequest) {
  const body = (await request.json()) as {
    password?: string;
    id?: string;
    status?: LeadStatus;
    adminNotes?: string;
    tasks?: string[];
    assignedTo?: string;
    lastContactedAt?: string;
  };

  if (!verifyAdminPassword(body.password)) {
    return unauthorized();
  }

  if (!body.id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const lead = body.status && !body.adminNotes && !body.tasks && !body.assignedTo && !body.lastContactedAt
    ? await updateLeadStatus(body.id, body.status)
    : await updateLead(body.id, {
        status: body.status,
        adminNotes: body.adminNotes,
        tasks: body.tasks,
        assignedTo: body.assignedTo,
        lastContactedAt: body.lastContactedAt
      });

  if (!lead) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  return NextResponse.json({ lead });
}
