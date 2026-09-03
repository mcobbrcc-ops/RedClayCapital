import { timingSafeEqual } from "node:crypto";
import { deliverWebsiteLeadOutbox } from "@/lib/internetLeadOutbox";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function authorized(request: Request) {
  const expected = process.env.CRON_SECRET?.trim();
  const received = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "").trim();
  if (!expected || !received) return false;
  const left = Buffer.from(expected);
  const right = Buffer.from(received);
  return left.length === right.length && timingSafeEqual(left, right);
}

async function run(request: Request) {
  if (!authorized(request)) return Response.json({ ok: false }, { status: 401 });
  try {
    return Response.json({ ok: true, ...(await deliverWebsiteLeadOutbox(20)) }, { headers: { "cache-control": "private, no-store" } });
  } catch (error) {
    console.error("[redclaycap] Lead outbox worker failed", { errorClass: error instanceof Error ? error.name : "unknown_error" });
    return Response.json({ ok: false, error: "Lead delivery worker is temporarily unavailable" }, { status: 503, headers: { "retry-after": "30" } });
  }
}

export const GET = run;
export const POST = run;
