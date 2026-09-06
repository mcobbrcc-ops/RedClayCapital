import { publicContact } from "@/lib/publicContact";
import { after, type NextRequest } from "next/server";
import { buildWebsiteLeadPayload, LeadValidationError, readLeadRequest } from "@/lib/internetLeadValidation";
import { deliverWebsiteLeadOutbox, durablyAcceptWebsiteLead, LeadIntakeError } from "@/lib/internetLeadOutbox";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const payload = buildWebsiteLeadPayload(await readLeadRequest(request));
    const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "";
    const accepted = await durablyAcceptWebsiteLead(payload, { ip: forwarded, userAgent: request.headers.get("user-agent") || "" });
    after(async () => {
      try { await deliverWebsiteLeadOutbox(2); }
      catch (error) { console.warn("[redclaycap] Durable lead delivery deferred", { errorClass: error instanceof Error ? error.name : "unknown_error" }); }
    });
    return Response.json({ ok: true, queued: accepted.submission_status !== "DELIVERED", duplicate: accepted.duplicate, reference: payload.externalSubmissionId }, { status: 202, headers: { "cache-control": "no-store" } });
  } catch (error) {
    if (error instanceof LeadValidationError || error instanceof LeadIntakeError) return Response.json({ ok: false, error: error.message }, { status: error.status, headers: { "cache-control": "no-store", ...(error.status === 429 ? { "retry-after": "3600" } : {}) } });
    console.error("[redclaycap] Durable lead acceptance failed", { errorClass: error instanceof Error ? error.name : "unknown_error" });
    return Response.json({ ok: false, error: `We could not confirm your request was saved. Please retry, or call or text ${publicContact.phone}.` }, { status: 503, headers: { "retry-after": "30", "cache-control": "no-store" } });
  }
}
