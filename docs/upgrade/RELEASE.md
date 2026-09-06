# Red Clay Capital release — September 5, 2026

Current contact update: see [September 6 contact release](../contact-update/RELEASE.md). The historical evidence below describes the earlier company-design release.

The company-focused website is live at https://redclaycap.com. The founder photograph, public owner callouts and founder structured-data field were removed before deployment, as requested. Company, process and NC/GA/OH market information now lead the presentation. No team size, offices, transaction history or scale claims were invented. Existing contact destinations are preserved.

## Release identity and authorization

- Application source: `22d9111dd7d99c73d5819a443fc9bb9e83c22636`, released by fast-forwarding the existing GitHub production branch `main`.
- First verified production deployment: `dpl_8n4PzbhppCvAMYyH6wH3GHyjwStM`, READY with domain assignment confirmed. Immutable URL: https://project-73xr5-ri6huehrn-red-clay-capital.vercel.app.
- Verified protected preview of the same source: `dpl_D2Nfdgew5nXfGTLJgcUzUmSoHrjU`, https://project-73xr5-khhs2dg74-red-clay-capital.vercel.app.
- Existing project: `prj_tx6iRynIeADLp2EF4loKPnWCVLMP` / `project-73xr5`; existing repository: `mcobbrcc-ops/RedClayCapital`. DNS and production integration environment were preserved.
- Prior production rollback target: `dpl_F6p23Dd8zDrmBD3zMgoPjTyEQ7HU`. Check the current project state before any future rollback.
- Documentation-only evidence commits may trigger another Vercel build of the same application source. The deployment above identifies the tested application release; inspect the project for its latest alias target.

Automatic review initially blocked the GitHub push for lack of explicit payload/destination approval. The user then explicitly approved source/QA-document publication and the existing Vercel release, conditioned on removing the founder focus. That condition was implemented and verified before publishing. This gate is resolved. Protected preview access still requires Vercel authentication; anonymous requests redirect to SSO with noindex. Vercel CLI generated its scoped deployment-protection token for authenticated preview reads without printing the value or disabling protection. Bulk production-secret export was not performed.

## Implemented and verified

The upgrade covers the homepage, focused /get-offer route, company/About/process/contact/FAQ pages, three substantive state hubs, nine seller guides, privacy notice, mobile navigation and offer/call/text actions. Lead capture uses the existing durable outbox, authenticated delivery, stable retry identity, explicit inquiry consent, sanitized attribution and deduplicated optional conversion tracking.

- `pnpm run check`: 23 behavioral tests and production build pass. GitHub production CI also passed: https://github.com/mcobbrcc-ops/RedClayCapital/actions/runs/34003965730. The existing nonfatal legacy-admin file-tracing warning is documented in HANDOFF.md.
- Responsive geometry: 12 of 12 home/offer checks pass at actual widths 320, 375, 390, 430, 768 and 1440px; no horizontal overflow.
- Automated accessibility: homepage, offer and NC hub each score 100 with no failed scored or unscored checks. This is not full WCAG certification.
- Production crawl: 49 routes, 43 successful pages, five correct permanent redirects and one intentional 404. All 37 original sitemap URLs are accounted for. Canonicals, indexability, JSON-LD, internal/contact links, sitemap, robots, Google verification and the 1200x630 social image pass. Rendered public pages contain no founder names or photographs. HTTPS/www consistency is verified.
- Live browser: the company panel renders and its NC link opens the correct state hub. Public recovery endpoint rejects unauthenticated access with 401.
- Four labeled NC/GA/OH/campaign browser submissions were accepted by the isolated local fixture. Double-click and simulated acceptance-failure/retry behavior passed. No production synthetic lead was submitted.

## Performance

Equivalent three-run mobile Lighthouse configurations were used before and after release. Before median: score 97, LCP 1.524s, TBT 185ms, CLS 0. After median: score 94, LCP 1.642s, TBT 242ms, CLS 0. Every after LCP is below 2.5s; every CLS is 0. The workstation benchmark was lower in after runs, and one run had elevated blocking time; these results do not establish a speed improvement or isolate the cause of the score decrease. Full reports and remaining bottlenecks are in performance/README.md. TBT is not INP. Search Console access was denied, so no 90-day traffic baseline or field Core Web Vitals was available. No ranking or conversion improvement is claimed.

## Remaining integration dependency

The separate RCI production release omitted the website receiver and Internet Leads view. Findings and this website release were sent to the active Communications Portal task with explicit user authorization. That task is restoring the receiver/UI/models, owner predicates and historical SQL secret guards while preserving its newer communications work. Its latest checkpoint remains local/in progress, not deployed or E2E proven.

Actual immutable recipient binding, owner-only records, owner notification/deep-link, tenant denial and backlog/dead-letter recovery remain pending. Local contract/mocked-outbox tests are not live RCI delivery proof. No canonical RCI files, production lead records, calls, texts, campaigns or number-provider settings were changed by this website task. Native iOS/Android app dispatch and actual voice/SMS routing also remain unverified. See rci-verification.md.

## Visual evidence and maintenance

Before images show the preceding public release; after images show the verified production-build source released above. A temporary mislabeled desktop screenshot was detected and replaced; final actual dimensions and geometry are documented in responsive-final.md.

| View | Before | After |
| --- | --- | --- |
| Desktop | [Before desktop](screenshots/before-desktop.png) | [After desktop](screenshots/after-desktop.png) |
| Mobile | [Before mobile](screenshots/before-mobile.png) | [After mobile](screenshots/after-mobile.png) |

Maintenance starts at HANDOFF.md. Production route evidence is in seo-production-verification.md; the prioritized measurement/content backlog and two proposed experiments are in seo-90-day-backlog.md. The optional local preview at http://127.0.0.1:3100 uses synthetic-only storage, not production.

