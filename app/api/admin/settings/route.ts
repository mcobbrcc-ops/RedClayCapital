import { NextResponse } from "next/server";
import { getDashboardSettings, saveDashboardSettings } from "@/lib/adminStore";
import { verifyAdminPassword } from "@/lib/leadStore";

export const runtime = "nodejs";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  if (!verifyAdminPassword(searchParams.get("password"))) return unauthorized();
  return NextResponse.json({ settings: await getDashboardSettings() });
}

export async function PATCH(request: Request) {
  const body = await request.json();
  if (!verifyAdminPassword(body.password)) return unauthorized();
  if (!body.settings) return NextResponse.json({ error: "Settings payload is required" }, { status: 400 });
  return NextResponse.json({ settings: await saveDashboardSettings(body.settings) });
}
