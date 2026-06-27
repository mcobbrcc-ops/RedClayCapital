import { NextResponse } from "next/server";
import {
  addAdminNotification,
  deleteAdminNotification,
  getAdminNotifications,
  updateAdminNotification
} from "@/lib/adminStore";
import { verifyAdminPassword } from "@/lib/leadStore";

export const runtime = "nodejs";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  if (!verifyAdminPassword(searchParams.get("password"))) return unauthorized();
  return NextResponse.json({ notifications: await getAdminNotifications() });
}

export async function POST(request: Request) {
  const body = await request.json();
  if (!verifyAdminPassword(body.password)) return unauthorized();
  const notification = await addAdminNotification({
    type: body.type || "System",
    title: body.title || "Admin notification",
    message: body.message || "",
    leadId: body.leadId || ""
  });
  return NextResponse.json({ notification });
}

export async function PATCH(request: Request) {
  const body = await request.json();
  if (!verifyAdminPassword(body.password)) return unauthorized();
  if (body.markAllRead) {
    const notifications = await getAdminNotifications();
    const updated = [];
    for (const notification of notifications) {
      updated.push(await updateAdminNotification(notification.id, { read: true }));
    }
    return NextResponse.json({ notifications: updated.filter(Boolean) });
  }
  if (!body.id) return NextResponse.json({ error: "Notification id is required" }, { status: 400 });
  const notification = await updateAdminNotification(body.id, body);
  if (!notification) return NextResponse.json({ error: "Notification not found" }, { status: 404 });
  return NextResponse.json({ notification });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  if (!verifyAdminPassword(searchParams.get("password"))) return unauthorized();
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Notification id is required" }, { status: 400 });
  await deleteAdminNotification(id);
  return NextResponse.json({ ok: true });
}
