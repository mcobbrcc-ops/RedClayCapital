# Local HTTP SEO verification

Verified September 5, 2026 against http://127.0.0.1:3100 (Next.js development server). These are local route/content results, not production verification or performance measurements.

## Results

- Crawled 49 routes: 43 returned 200, five returned permanent 308 redirects, and an intentionally unknown test path returned 404.
- The crawl includes all 37 URLs in the saved production sitemap, the new state hubs, offer page, privacy page, investor-offer guide, and internal navigation destinations.
- All 200 pages have exactly one H1, a nonempty description, and the intended canonical. `/our-buying-process` correctly canonicalizes to `/how-it-works`.
- All five duplicate `/areas-we-serve/{city}-nc` routes redirect to the exact existing `/sell-your-house-fast-{city}-nc` counterpart. Location headers were read case-insensitively.
- `/testimonials`, `/recently-purchased-properties`, and `/reviews` remain available with `noindex, follow`.
- No broken same-page fragment links or JSON-LD parse errors were found. No legacy (888) 626-3213 number or link was found in rendered pages.
- The public source scan found no old phone references, 512-pixel social dimensions, `RealEstateAgent`, or unsupported `human-written` wording in app/components/content.
- `/robots.txt` returned 200 with public crawling allowed, admin/API exclusions, and the production sitemap URL.
- `/google3b135227f2cfe181.html` returned 200 with the original verification token. The file was not edited.
- `/social-preview.png` returned 200 as image/png; its actual dimensions are 1200 × 630.

The first concurrent crawl observed one 500 on `/blog/sell-fire-damaged-house-north-carolina`. An immediate individual retry returned 200, and the entire subsequent crawl passed. The evidence retains the initial failure; development compilation/HMR is a possible cause, not a confirmed diagnosis. Recheck in a production build and after release.

## Issues handed to the integrating task

At the time of this crawl, `/get-offer` supplied page-level Open Graph metadata without an image, which overrides the layout image. Add the shared social image and its 1200 × 630 dimensions to that page. Other owned content pages use the correct shared image and omit dimensions; none reports the previous 512 × 512 size.

The `.faq-list` wrapper had no literal CSS selector during the scan. Many new homepage/form/mobile classes were also absent while the integrating task was still writing the stylesheet. This source scan is not a visual failure finding; include the FAQ details controls in the final browser/keyboard review.

The privacy copy is compatible with the implementation described by the integrating task: contact-reply permission, no marketing permission, optional analytics default off, Do Not Track respected, per-tab session attribution, and no browser persistence of form personal data. The final notice now explicitly explains optional analytics choice, the choice retained locally, referral/campaign context stored for the tab session, and inquiry availability when analytics is declined. It also describes the purpose and use of inquiry/attribution data, how to ask for correction/deletion, and separation from marketing.

## Evidence

- `seo-route-inventory.json`: source-level baseline coverage, city redirect map, and related-link checks.
- `seo-http-crawl.json`: full route metadata, schema, anchors, status results, and retained first-pass error.
- `seo-preview-sitemap.xml`: exact sitemap returned by the local preview.
- `seo-handoff.md`: route/intent decisions and primary source register.
- `seo-90-day-backlog.md`: measurement, content priorities, and two future experiments.

The parent task owns final browser testing, build/release evidence, and repetition of the route/indexability checks on production. No commit or deployment was performed by this content task.
