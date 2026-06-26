import { NextRequest, NextResponse } from "next/server";
import {
  filterLeads,
  getLeads,
  leadsToCsv,
  LeadStatus,
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
  };

  if (!verifyAdminPassword(body.password)) {
    return unauthorized();
  }

  if (!body.id || !body.status) {
    return NextResponse.json({ error: "Missing id or status" }, { status: 400 });
  }

  const lead = await updateLeadStatus(body.id, body.status);

  if (!lead) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  return NextResponse.json({ lead });
}
