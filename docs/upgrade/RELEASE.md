# Release status — September 5, 2026

## Reviewable result

The existing Next.js seller website has been upgraded in the canonical RedClayCapital checkout. Local production preview: http://127.0.0.1:3100. The preview uses an isolated synthetic lead fixture; it is not connected to production lead storage. The current public site at https://redclaycap.com has not been replaced by this task.

Initial implementation commit: `89aabf3`, branch `codex/astra-website-upgrade`, based on the existing durable-outbox release `d51f155`. Subsequent accessibility and final QA corrections are recorded on the same branch.

The upgrade includes the redesigned homepage, focused offer page, phone/text actions, owner identity, substantive North Carolina/Georgia/Ohio hubs, revised credibility pages and seller guides, privacy details, safer durable lead intake and retries, consent-aware attribution and conversion hooks. See HANDOFF.md for maintenance details and the evidence directory for individual checks.

## Release gate

Automatic approval review rejected the attempted GitHub push because it considered the website source and internal QA documents sensitive code/data egress to a destination lacking explicit payload-and-destination approval. The remote is the verified existing `mcobbrcc-ops/RedClayCapital` repository, but the review still requires explicit approval for this push. Nothing was pushed or deployed. The user has been presented with the completed local result and an approval request naming the source, QA documents, existing GitHub destination, existing Vercel project, and public domain.

Once that approval is granted:

1. Push the tested upgrade branch to the existing GitHub remote. Preserve unrelated work and inspect any newer remote commits first.
2. Use the existing linked Vercel project `prj_tx6iRynIeADLp2EF4loKPnWCVLMP` / `project-73xr5` to create or reuse a protected preview. Existing SSO protection is `all_except_custom_domains`; do not disable it. Preview does not have production lead credentials and must not accept real seller test data.
3. Verify the preview build and release the same source through the established main/CLI production workflow. Preserve the production environment and DNS.
4. Record deployment ID, immutable URL, commit, production-alias status and checks here. Rollback target is prior deployment `dpl_F6p23Dd8zDrmBD3zMgoPjTyEQ7HU`; inspect whether another release has superseded it before acting.
5. Repeat the route/indexability/schema/contact checks against the public alias and the three equivalent mobile Lighthouse samples in performance/README.md. No post-release performance result exists yet.

## Evidence and limitations

- Production build and 23 behavioral tests pass. Tests cover durable acceptance, retry identity, downstream outage/recovery, consent, attribution, blocked tracking and conversion deduplication.
- All 37 original sitemap URLs are accounted for; the local 49-route crawl passed with 43 successful pages, five intended permanent redirects and one intentional 404. Google verification is preserved.
- Four labeled local browser journeys cover NC, GA, OH and a campaign landing page. The double-click and simulated acceptance failure/retry checks produced four accepted synthetic records total. These are local fixture results, not live RCI delivery proof.
- Final local accessibility reports for home, offer and NC hub scored 100 with no failed scored or unscored audits. This does not certify full WCAG conformance.
- All12 final responsive geometry checks passed for home and offer at320,375,390,430,768 and1440px: actual viewport dimensions were confirmed, document width equals client width, and no visible elements overflow. See responsive-final.json. A late browser resize issue caused one desktop screenshot to be temporarily saved as a duplicate mobile image; it was detected and replaced with a verified capture. The initial review files retain that discovery for traceability.
- Baseline mobile lab median: score 97, LCP 1.524 seconds, TBT 185 milliseconds, CLS 0. Post-release lab comparison remains pending. Search Console denied the current account access, so no 90-day traffic baseline or field Core Web Vitals was available. No improvement in traffic, ranking or conversions is claimed.
- The separately maintained RCI production release omitted the receiver and Internet Leads view. With the user's explicit authorization, findings were sent to the active Communications Portal task, which owns restoration. Immutable recipient binding, owner notification/deep-link, owner-only record visibility and tenant denial remain unverified until that restoration supplies actual evidence.
- No production synthetic lead, seller contact, call, text, campaign or provider-number mutation was performed. Native iOS/Android app dispatch and actual voice/SMS routing remain unverified.

## Before and after

Before screenshots were captured from the existing public release. After screenshots show the upgraded local production build.

| View | Before | After |
| --- | --- | --- |
| Desktop | [Before desktop](screenshots/before-desktop.png) | [After desktop](screenshots/after-desktop.png) |
| Mobile | [Before mobile](screenshots/before-mobile.png) | [After mobile](screenshots/after-mobile.png) |

## RCI coordination boundary

The website task does not modify or roll back the dirty canonical RCI checkout. The Communications Portal task is restoring the integration while preserving its newer work, checking strict owner predicates and a potential NULL-secret bypass in the historical acceptance/claim SQL. Its latest checkpoint confirms selected receiver/UI/models and local owner-scoping repairs are in progress; missing-secret SQL regression and migration validation remain unfinished. This historical source finding is not evidence of a production exploit. Its deployed recorder repair dpl_1ciunhyhynpPFUZjdrg2buVNzAfT does not include or prove Internet Leads restoration. See rci-verification.md for the surgical restoration requirements and original evidence.
