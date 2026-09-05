# RCI integration verification — 2026-09-05

This is a read-only source, deployment-metadata and focused-unit-test checkpoint. No seller submission, production data write, setup mutation, replay, call, text, email, migration or deployment was performed.

## Critical production finding

The current RCI production release **omits the previously deployed Internet Leads receiver, view and APIs**. End-to-end delivery cannot be called verified.

| Item | Verified evidence |
| --- | --- |
| Public website | `https://redclaycap.com`, Vercel `project-73xr5`, project `prj_tx6iRynIeADLp2EF4loKPnWCVLMP`, team `team_dfWQIWJNubn9ZAMdl5a1oGeg` |
| Website baseline release | `dpl_F6p23Dd8zDrmBD3zMgoPjTyEQ7HU`, `https://project-73xr5-mjxtptfu7-red-clay-capital.vercel.app`, created September 2, 2026 at 23:14 EDT; Ready Production |
| Website release source | Vercel API reports `source=cli`, `githubCommitSha=d51f15582ae3f760fab2ca457ef3c6a5dc017b56`, `githubCommitRef=main` |
| Website actual deployed functions | `api/leads` and `api/internal/lead-outbox`; deployment cron is `*/5 * * * *` for the outbox endpoint |
| Current RCI | `https://intelligence.renting2riches.com`, Vercel `red-clay-intelligence`, project `prj_rHvUxmR1kE0KY5x6ysZjGsB1w2HH` |
| Current RCI release | `dpl_4feL3TTtHV2xVBLMHFnwYhWqb9Er`, `https://red-clay-intelligence-aoonc6pag-red-clay-capital.vercel.app`, September 5 at 17:44 EDT |
| Missing-route proof | Parsed all 650 output paths returned by `vercel inspect --json`: zero paths matching `internet-lead` or `integrations/leads` |
| Historical receiver release | `dpl_2MRgeKMybubuAEjRr9K2NvCZJAQB`, `https://red-clay-intelligence-i5eptjdce-red-clay-capital.vercel.app`: deployment inventory includes receiver, list, detail, notifications, replay, setup and Communications Internet Leads page, including RSC variants |
| Current source provenance | Vercel deployment API: `source=cli`, `gitCommitSha=d74efba8a52ba900f6f01464d341e47d58c694b3`, branch `codex/production-platform`, `gitDirty=1`. This matches canonical RCI HEAD; canonical working tree contains extensive existing modified/untracked work |

An unsigned empty POST to the current receiver path redirects HTTP 307 to `/access`; unauthenticated GET probes return 404 HTML. The deployed route inventory resolves the ambiguity: the receiver is absent. The public website worker returns 401 to an unauthenticated GET, without claiming/processing submissions.

## Existing implementation and durability

Source inspected: canonical public repository plus RCI `.deploy/internet-leads` worktree at `c09d155c84b47336764601638190f311cc8f3a44`. The canonical RCI root itself currently lacks the Internet Leads feature. Older canonical audit notes that called the integration unimplemented did not inspect this release worktree; they are not proof of the deployed history.

- Website acceptance commits through `website_accept_lead_outbox` before HTTP 202. Database RPCs authenticate separate acceptance and worker secrets; website routing comes from server environment, not submitted user/workspace IDs.
- Receiver contract is `2026-09-02.v1`; HMAC SHA-256 binds version, timestamp, nonce, body hash, method and path. Clock skew is limited to 300 seconds; nonces are durably unique; signature comparison is timing-safe; request body is bounded at 65,536 bytes.
- `WebsiteLeadIntegration` stores immutable workspace and owner user foreign keys. Existing setup refuses to rebind an existing integration to another user/workspace. Actual production binding IDs have **not** been read or confirmed. Mutable handles are not routing proof.
- Intake requires a matching accepted outbox row/body hash, locks it, and creates inquiry, canonical contact/property/lead links, notification, review task and audit events in one Serializable transaction. Retry returns the existing inquiry before creating another notification. Unique indexes protect integration/submission and inquiry/notification identity.
- Outbox uses leases, `FOR UPDATE SKIP LOCKED`, retry/backoff+jitter, up to eight attempts, dead-letter status and operator replay. Timeout after a committed receiver write can recover using the same submission ID.
- In-app notification is addressed to the integration owner, stored durably, and links to `/communications/internet-leads?inquiry=<id>`. Creation does not send outbound communications.
- Lead tables have RLS enabled and public/anon/authenticated direct table privileges revoked in the migration. Scoped RPCs use secret checks. Existing tests assert these SQL declarations; actual deployed RLS/session behavior is not verified.
- Historical receiver deployment build logs say `70 migrations found` and `No pending migrations to apply` at 2026-09-03T05:09Z. This is historical migration-run evidence, **not** current database schema or row-state verification.

## Owner-only caveat and exact restoration requirements

Existing notifications filter workspace plus user. Existing inquiry list/detail/update and aggregate queries filter workspace only. Therefore they do not restrict Internet Leads to the intended owner when multiple authorized members share that workspace.

A strict owner-only Internet Leads repair should use `workspaceId = context.workspaceId AND recipientUserId = context.userId` for list, detail, update preflight, related previous inquiries, all counts/grouping and raw summary SQL. Integration health and replay must additionally require `integration.ownerUserId = context.userId`; roles alone do not identify the intended recipient. Existing setup must preserve the current immutable binding rather than create or rotate it blindly. Another workspace must receive no lead, no notification, no count or private metadata.

Canonical Contact/Lead/Property objects currently use broader workspace ACLs. Restricting this view alone does not prove those linked records invisible to another authorized teammate in the same workspace. Distinguish owner notification/routing from all-object private ownership.

The original `2d75e12` integration commit includes unrelated schema formatting and lockfile changes (31 files; 5,262 insertions), so do not wholesale cherry-pick over the dirty canonical RCI tree. Safest minimal implementation restoration:

1. Preserve/snapshot current dirty canonical source. Current production cannot be reproduced from its recorded git SHA alone.
2. Restore the seven new models (`WebsiteLeadIntegration`, `WebsiteLeadSubmission`, `WebsiteLeadDeliveryAttempt`, `WebsiteLeadWebhookNonce`, `WebsiteLeadRateBucket`, `InternetLeadInquiry`, `InternetLeadNotification`) and their relations on User, Workspace, Contact, Lead and PropertyIntelligenceProperty. Preserve newer schema additions; inspect database migration state before migration decisions.
3. Restore `src/lib/internet-leads/*`, receiver and six Internet Leads API routes, page/loading/client and notification UI from the existing release worktree. Keep newer communications/provider code; verify referenced readiness methods against current implementations.
4. Surgically add `promoteWebsiteInquiryToLeadInTransaction` (97 lines) to the current promotion service, two tenancy registrations in `src/lib/db/prisma.ts`, signed receiver classification in the security generator, and navigation/page/bell wiring. Regenerate manifests from current source rather than replacing them wholesale.
5. Preserve transaction timeout fix `9e52573` (maxWait 1,500ms, timeout 10,000ms; website request timeout 15,000ms), later source fixes, and implement the owner predicates above.
6. Conflict-sensitive existing dirty files include Prisma schema, Prisma wrapper, shell UI, security generators/manifests and several old source-assertion tests. Keep all unrelated changes, package/lockfile versions, working calling integrations and current notification improvements.
7. Run actual auth/tenant/Postgres tests and a protected staging journey before one verified release. After receiver restoration, inspect and recover accepted pending/dead-letter submissions deliberately; do not assume missing-route responses were retryable.

## Access and exact evidence boundary

Authenticated Vercel CLI access works as `mcobbrcc-7402`. Cached executable:

`node C:/Users/micha/AppData/Local/npm-cache/_npx/67eb4586ca667318/node_modules/vercel/dist/index.js`

The linked public release worktree is `C:/Users/micha/Documents/RedClayConnections/.deploy/redclaycap-internet-leads`; its `.vercel/project.json` identifies the public project. Project inspection confirms Next.js, root `.`, Node 24. The canonical public repository had no `.vercel` link at discovery. Existing production workflow is CLI deployment; prepare a linked verified checkout with the same project and run the established CLI preview deployment (`deploy`) or production deployment (`deploy --prod`) only after required checks. Preview lead credentials are not configured based on the environment-name inventory. A preview build must not accidentally use production intake for test submissions. This report did not deploy.

Vercel environment-name inventory confirms all ten public production keys exist: `WEBSITE_OUTBOX_SUPABASE_URL`, `WEBSITE_OUTBOX_SUPABASE_KEY`, `WEBSITE_INTEGRATION_ID`, `WEBSITE_INTEGRATION_ACCEPT_SECRET`, `WEBSITE_INTEGRATION_WORKER_SECRET`, `RCI_INTAKE_URL`, `RCI_INTAKE_KEY_ID`, `RCI_INTAKE_HMAC_SECRET`, `LEAD_INTAKE_HASH_SALT`, `CRON_SECRET`. RCI Production also has the initial website integration identity/secret names. Values, correctness, actual receiving URL, enabled binding, backlog and notification delivery remain unverified.

Both deploy worktrees' local env files contain only `VERCEL_OIDC_TOKEN`. Canonical RCI `.env.local` is explicitly staging (`gyvxwqpwxzhxztboalun.supabase.co`, `red-clay-intelligence-staging.vercel.app`); do not substitute it for production. The environment manifest identifies production Supabase `cxblqwjuhxhggmpanmmi` and prohibits production test operations.

Automatic approval review rejected a requested whole-production `vercel env pull` into a local temporary file because it would broadly export production secrets and safer metadata checks exist. No export occurred; the rejection was not bypassed. Authenticated browser access or specifically authorized narrow access is still required for actual immutable mapping, current database state, owner-session notification and cross-workspace delivery verification.

## Tests run

`node node_modules/vitest/vitest.mjs run tests/internet-leads-contract.test.ts` in `.deploy/internet-leads`: **7/7 passed**, 23.44 seconds, September 5 at 18:06 local. Covers contract, consent-channel constraints, signature canonicalization, migration declarations, communication-readiness source guards and transaction timeout. These are unit/static checks, not persisted production or end-to-end tests.

Public number `(919) 778-1228` call/SMS transport, owner handset delivery, provider inbound routing and external messaging were not exercised. Contact links do not establish provider capability.
