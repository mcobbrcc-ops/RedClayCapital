import { NextResponse } from "next/server";
import { deleteAdminEvent, getAdminEvents, saveAdminEvent } from "@/lib/adminStore";
import { verifyAdminPassword } from "@/lib/leadStore";

export const runtime = "nodejs";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  if (!verifyAdminPassword(searchParams.get("password"))) return unauthorized();
  return NextResponse.json({ events: await getAdminEvents() });
}

export async function POST(request: Request) {
  const body = await request.json();
  if (!verifyAdminPassword(body.password)) return unauthorized();
  try {
    return NextResponse.json({ event: await saveAdminEvent(body) });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to save event" }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  const body = await request.json();
  if (!verifyAdminPassword(body.password)) return unauthorized();
  if (!body.id) return NextResponse.json({ error: "Event id is required" }, { status: 400 });
  try {
    return NextResponse.json({ event: await saveAdminEvent(body) });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to save event" }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  if (!verifyAdminPassword(searchParams.get("password"))) return unauthorized();
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Event id is required" }, { status: 400 });
  await deleteAdminEvent(id);
  return NextResponse.json({ ok: true });
}
