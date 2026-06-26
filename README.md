# Red Clay Capital Website

Production Next.js website for Red Clay Capital, LLC.

## Production Domain

Canonical domain: `https://redclaycap.com`

The `www` host should redirect to the apex domain:

- `http://redclaycap.com` -> `https://redclaycap.com`
- `http://www.redclaycap.com` -> `https://redclaycap.com`
- `https://www.redclaycap.com` -> `https://redclaycap.com`

## Local Development

```powershell
pnpm install
pnpm run dev
```

Local URL: `http://localhost:3000`

## Production Build

```powershell
pnpm run build
```

## Deployment Workflow

Recommended hosting provider: Vercel.

Branch strategy:

- `main`: production
- `dev`: preview/staging

Recommended workflow:

1. Make edits in Codex.
2. Run `pnpm run build`.
3. Commit changes to `dev`.
4. Push to GitHub.
5. Review Vercel preview deployment.
6. Merge `dev` into `main`.
7. Vercel automatically deploys production.

## Required Environment Variables

Copy `.env.example` into Vercel project environment variables.

Server-only variables:

- `LEAD_CAPTURE_WEBHOOK_URL`
- `LEAD_CAPTURE_WEBHOOK_SECRET`
- `EMAIL_NOTIFICATION_WEBHOOK_URL`
- `CRM_WEBHOOK_URL`
- `GOOGLE_MAPS_API_KEY`

Public tracking variables:

- `NEXT_PUBLIC_SITE_URL=https://redclaycap.com`
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- `NEXT_PUBLIC_GTM_ID`
- `NEXT_PUBLIC_GOOGLE_ADS_ID`
- `NEXT_PUBLIC_META_PIXEL_ID`

Do not prefix secrets with `NEXT_PUBLIC_`.

## Lead Capture

The primary form anchor is `/#get-my-cash-offer`.

The lead form posts to `/api/leads`. In production, configure `LEAD_CAPTURE_WEBHOOK_URL` to a secure backend, CRM, Zapier, Make, n8n, or custom lead database endpoint. Without this variable, production submissions return a configuration error so leads are not silently lost.
