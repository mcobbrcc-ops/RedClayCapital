# Production SEO and company-brand verification

Release: `dpl_8n4PzbhppCvAMYyH6wH3GHyjwStM`, company revision `22d9111`.
Production: https://redclaycap.com.
Crawl completed: September 6, 2026 at 01:30 UTC (September 5 in America/New_York).

The read-only crawl passed with no findings: 49 tested routes, including all 37 baseline sitemap URLs. There were 43 successful pages, five exact permanent redirects, and one intentional unknown-page 404. No production forms were submitted.

Every successful public page had one H1, a description, its intended canonical, working call/text link markup for (919) 778-1228, the shared social image, and valid JSON-LD. Public pages were indexable except the deliberately excluded proof pages (`/reviews`, `/testimonials`, `/recently-purchased-properties`). `/our-buying-process` retained its canonical to `/how-it-works`.

All five duplicate city URLs returned 308 to their existing corresponding local page. The sitemap, robots file, original Google verification file, and social preview returned 200. The social PNG is 1200 × 630. Schema types were Organization, BreadcrumbList, and Article; no unsupported real-estate-agent or review schema was present.

The company presentation was verified in the rendered HTML: no founder names or portrait references were found in the crawled pages. Additional raw-source checks on the homepage, About, offer request, and Reviews pages found no Michael Cobb name, founder portrait reference, or founder schema. The existing business contact mailbox remains unchanged.

Origin redirects are permanent and consistent:

- `http://redclaycap.com/` → `https://redclaycap.com/` (308).
- `https://www.redclaycap.com/` → `https://redclaycap.com/` (308).
- `http://www.redclaycap.com/` → `https://www.redclaycap.com/` → `https://redclaycap.com/` (two 308 hops).

Evidence: `seo-production-crawl.json`, `seo-production-origin-checks.json`, and `seo-production-company-source.json`. The equivalent local company revision also passed; see `seo-company-local-crawl.json`.

The reusable read-only script is `scripts/seo-release-crawl.py`:

```powershell
python scripts/seo-release-crawl.py --base https://redclaycap.com --output docs/upgrade/seo-production-crawl.json --label 'Production release verification'
```

These findings verify HTTP content, routing, and SEO configuration. They do not measure rankings, organic traffic improvement, field performance, browser layout, or production lead delivery.
