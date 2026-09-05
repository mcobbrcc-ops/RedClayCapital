# Red Clay Capital website upgrade handoff

Updated September 5, 2026. This file is the maintenance entry point.

## Project and release

- Public seller website: https://redclaycap.com; https://www.redclaycap.com permanently redirects to apex.
- Canonical checkout: C:/Users/micha/Documents/RedClayCapital.
- GitHub: mcobbrcc-ops/RedClayCapital. Upgrade branch codex/astra-website-upgrade begins at d51f155 (the existing durable-outbox release); clean original checkout was behind this integration.
- Existing Vercel project project-73xr5 / prj_tx6iRynIeADLp2EF4loKPnWCVLMP, Red Clay Capital team. Git production branch main. CLI releases are also established deployment history. Do not create a replacement Sites project or change DNS.
- Preview protection verified: Vercel SSO all_except_custom_domains. Keep protection enabled.
- Prior public deployment / rollback target: dpl_F6p23Dd8zDrmBD3zMgoPjTyEQ7HU.
- Release identifiers and final production checks: see RELEASE.md (completed during deployment).

## Routes and identity

Home /; focused offer /get-offer; legacy /#get-my-cash-offer anchor retained. /property-review existing permanent redirect retained. About /about-red-clay-capital, process /how-it-works, /areas-we-serve, /contact, /faq, /privacy, /blog and nine guides. NC/GA/OH hubs /areas-we-serve/north-carolina, /areas-we-serve/georgia, /areas-we-serve/ohio.

All 37 pre-upgrade sitemap URLs preserved. Five duplicate city URLs permanently redirect to the existing equivalent root city pages. The Google verification file is unchanged. Reviews/proof URLs remain accessible, with unsupported seeded review content removed from public rendering and empty-proof destinations excluded from search. Do not republish the legacy anonymous seeded testimonials without evidence and permission.

Phone is centralized in content/site.ts: (919) 778-1228, tel:+19197781228, sms:+19197781228. The existing supplied founder image is reused and optimized by Next Image, with dimensions and hero preload. No new offices, reviews, response-time guarantees, closing promises or transaction counts were invented.

## Lead integration and remaining dependency

/api/leads validates a bounded request and commits through the existing Supabase website_accept_lead_outbox before success. The client's submissionId and submittedAt are frozen with its request body for retries; changed fields/new inquiry get a new ID. Database createdAt is authoritative server acceptance time. HMAC worker uses the immutable server-configured integration mapping. It never forwards a signed body to redirects. Missing/gated receiver routes remain retryable configuration failures. Durable replay, tenant mapping and rate buckets live in the existing RCI database implementation.

The separate RCI current production release omitted the receiver and Internet Leads view. Michael explicitly authorized sending the evidence to the active Communications Portal task, which acknowledged ownership of surgical restoration while preserving newer communications work. No canonical RCI files were changed by this website task. Do not claim owner-only delivery until that task supplies actual immutable binding, owner-session notification/deep-link and tenant-isolation proof. The old RCI source restricted inquiry reads by workspace rather than excluding teammates; the exact fix and broader canonical record ACL caveat are in rci-verification.md.

No real seller was contacted, no calls/texts were placed, and no production test lead records were created. Whole-production env export was rejected by auto-review and did not occur. Existing metadata-only Vercel access works. Production manifest disallows production tests; use approved verification facilities.

## Measurement and privacy

Optional analytics is off until chosen, honors Do Not Track, and uses the existing configured GA or GTM (one event owner). Accepted-lead conversion is receipt-deduplicated and fires only after acceptance; call/text taps are intent only. No form fields or raw URL query/referrer are sent to general analytics. GTM container configuration remains an external verification dependency. No new analytics account or paid service was created.

Versioned inquiry contact permission is separate from future marketing (none requested). Form PII is held only in the mounted flow and request; no local/session storage draft. Sanitized first/latest acquisition context uses per-tab sessionStorage, analytics choice uses localStorage, and dedup stores hashed receipts. Missing attribution is unknown. Browser/storage/tracker failures do not block submissions.

Search Console account is signed in but denied the attempted domain property. 90-day query/page/geo/device/conversion exports and field Core Web Vitals remain unavailable; no ranking/traffic/conversion lift claimed. See seo-90-day-backlog.md for a prioritized 90-day content/measurement plan and two future experiment designs.

## Verification

- TypeScript and production build passed; homepage now static. Existing nonfatal Next trace warning is in legacy admin file storage; public lead intake does not use it. Tracing excludes docs/tests/.tmp/.data/.git.
- 23 behavioral server/tracking tests passed, including acceptance failure, exact retry, rate limits, receiver outage/recovery and redirect handling, consent and preference, attribution, blocked tracking/storage, conversion dedup.
- Actual adjacent RCI Zod payload compatibility passes for phone/SMS/email-only. Seven existing RCI contract tests pass. These are not live delivery proof.
- 49-route HTTP crawl: 43 successful pages, five expected 308 redirects, one intentional 404; canonicals/descriptions/H1/JSON-LD/anchors and verification file checked. One transient dev-compile 500 resolved and full recrawl passed; repeat production crawl in RELEASE.md.
- Browser home and offer widths 320, 375, 390, 430, 768 and 1440 had no horizontal overflow; menu open/Escape close verified. Screenshot shows entered email retained on failure and retry remains unobscured. Form-field focus hides mobile actions; safe-area padding preserves content.
- Four labeled browser flows (NC, GA, OH, campaign) accepted by an isolated local synthetic RPC fixture using the actual production build. Ohio double click generated one request. Campaign simulated storage failure recovered to one acceptance. Exactly four accepted local records, no production/RCI writes. Raw synthetic evidence is in local-synthetic-submissions.json; do not call this RCI E2E.
- iOS/Android messaging app dispatch and provider voice/SMS capabilities of the requested phone remain untested; correct call/text URI attributes verified without initiating communications.
- Before/after images in screenshots/. Mobile lab baseline three-run median score97, LCP1.524s, TBT185ms, CLS0. Matched post-release values recorded in performance/README.md. TBT is not INP; lab is not 75th-percentile field data.

## Routine maintenance

Use pnpm lockfile; run pnpm run check. Keep state hubs substantive, retain useful URLs, verify legal claims with the primary sources in seo-handoff.md, and use the same phone constants. Test lead changes with node --test tests/*.test.cjs and the actual RCI contract. scripts/start-local-qa.cjs is explicitly local, synthetic only, requires a successful build and free ports 3100/3222; it cannot contact production and is excluded from deploy uploads. Do not deploy its environment configuration.
