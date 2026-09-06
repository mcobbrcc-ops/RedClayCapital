# Final local automated accessibility verification — September 5, 2026

Target: isolated local production build at `http://127.0.0.1:3100`, using Lighthouse 13.4.1 with fresh headless Edge profiles, mobile 390 × 844. No form submission occurred. This audit is separate from manual keyboard/menu/zoom checks and is not proof of full WCAG 2.2 AA conformance.

| Page | Score | Actionable audit findings |
| --- | ---: | --- |
| Homepage | 100 | None detected |
| `/get-offer` | 100 | None detected |
| `/areas-we-serve/north-carolina` | 100 | None detected |

All three final runs completed without runtime errors, Lighthouse warnings or failed audits, including unscored checks. Results were verified from individual audit outcomes as well as category scores.

The final rebuilt bundle fixes both discovered issues. The header now derives its accessible name from wordmark content with literal whitespace between words. The state sidebar's filled CTA now uses its intended light text with sufficient contrast.

Correction history:

- Header selector `main.page > header.site-header > div.container > a.brand`: the explicit accessible-name override failed `label-content-name-mismatch`, even while Lighthouse scored the homepage and offer page 100. Removing the override resolved the failure. The decorative `RC` mark remains hidden from assistive technology.
- State-hub selector `div.container > aside.article-sidebar > div.subpage-contact > a.button`: initial `Tell us about your property` foreground `#9d351f` on background `#913d2c` failed at 1.01:1. Its corrected text now passes the audit.

The JSON and HTML reports alongside this file were regenerated after the approved company-focused redesign replaced the founder portrait with the company/market panel and updated shared footer wording. All three pages were audited again: 100, no failed audits, no warnings and no runtime errors. The final privacy-link/new-tab-label and notice-text changes are included. These latest reports replace the earlier design's local audits.

This verifies the tested pages against automated checks; it is not a public production audit or a claim of full WCAG conformance. Manual usability findings are recorded separately by the release owner.
