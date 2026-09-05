# Red Clay Capital public seller website

Canonical public site: https://redclaycap.com
Repository: https://github.com/mcobbrcc-ops/RedClayCapital
Framework: Next.js 16 / React 19, pnpm; existing Vercel project `project-73xr5`.

This is the homeowner website. Red Clay Intelligence is a separate operational application at https://intelligence.renting2riches.com. Renting2Riches is a separate product.

## Develop and verify

`pnpm install --frozen-lockfile`
`pnpm run dev`
`pnpm run check`

The old `next lint` command is not supported in Next 16. No ESLint setup existed; the check runs TypeScript, focused behavioral tests and the production build.

## Lead delivery

The form posts to `/api/leads`. Success requires a committed receipt from the existing Supabase `website_accept_lead_outbox` RPC. No public submissions use the legacy admin file store. The signed worker sends queued submissions to the existing RCI receiver. `/api/internal/lead-outbox` requires `CRON_SECRET`; Vercel runs a recovery sweep every five minutes. Preserve all existing integration IDs and secrets; never accept a visitor-provided workspace or owner.

The form retains the exact submission ID and payload for retries. A later edited inquiry receives a new ID. See `docs/upgrade/rci-verification.md` for the production receiver regression and the limits of current verification.

`/admin` is a legacy private tool. Set a strong server-only `ADMIN_PASSWORD` if it must be used; no fallback password exists. It does not represent RCI Internet Leads. Its file storage is not durable on Vercel.

## Release

Preserve the existing Vercel project and domain. The documented branch path is preview (`dev`) then production (`main`); deployment history also records authenticated Vercel CLI releases. Run checks, deploy a protected preview to the existing project, verify, then release the same source using the authorized workflow. Record the release and prior deployment for rollback. Never roll back the entire separate RCI app to fix a missing integration.

See `docs/upgrade/HANDOFF.md` for route, contact, deployment, QA and maintenance evidence.
