# SEO preservation and content handoff

Updated September 5, 2026. Public project: `C:/Users/micha/Documents/RedClayCapital`; canonical production origin: https://redclaycap.com. The parent task owns deployment and production verification. This report does not claim measured search, lead, ranking, or conversion improvements.

## Access and decisions

The repository and saved production sitemap provide the route baseline. No Search Console query export, GA traffic export, or verified city-level lead analysis was available to this content task. Consequently the work preserves existing local URLs, adds state hubs for the user-specified NC/GA/OH markets, and does not invent search volumes or city demand. New city pages should wait for confirmed service fit and useful independent local information.

The owner and phone are authorized by the upgrade brief: Michael Cobb; (919) 778-1228. The shared configuration is `content/site.ts`, including `phoneHref` and `smsHref`. Business proof was not supplied; no transaction counts, testimonial quotations, offices, certifications, guaranteed terms, or claims of brokerage licensing were added.

## Route and intent map

| Route group | Primary intent | Preservation decision |
| --- | --- | --- |
| `/` | Understand the business and start a seller conversation | Existing URL retained; root task implementation |
| `/get-offer` | Submit a property inquiry | New focused conversion page; root task implementation |
| `/how-it-works` | Understand review, proposal, and closing steps | Existing URL retained; expanded |
| `/our-buying-process` | Same process intent | Existing page remains available; canonical points to `/how-it-works`; removed from sitemap |
| `/about-red-clay-capital`, `/contact`, `/faq` | Business identity, contact, objections | Existing URLs retained; rewritten with substantive answers |
| `/areas-we-serve` | Find a focus market | Existing URL retained; links all three state hubs and existing city guides |
| `/areas-we-serve/north-carolina` | NC as-is sale considerations | New original hub; estate and deadline resources |
| `/areas-we-serve/georgia` | GA property sale considerations | New original hub; estate, rental, and distance checklist |
| `/areas-we-serve/ohio` | OH property sale considerations | New original hub; vacancy, repairs, and estate checklist |
| `/blog` | Find a relevant seller guide | Existing URL retained; accurate descriptions; removed unsupported “human-written” label |
| Eight pre-existing `/blog/*` URLs | Repair, tenancy, financing, fire damage, foreclosure, code, inheritance, vacancy questions | All retained and expanded with decision checklists; no content-volume churn |
| `/blog/understanding-an-investor-offer` | Compare direct offer and listing | New original guide; net-proceeds and written-condition comparison |
| Five `/sell-your-house-fast-{city}-nc` URLs | Existing local sale intent | All retained; distinct checklist and guide for each |
| Six existing canonical `/areas-we-serve/{city}-nc` URLs | Existing local sale intent | Retained; distinct substantive sale-planning content |
| `/areas-we-serve/{burlington,graham,greensboro,haw-river,roxboro}-nc` | Duplicate local intent | Permanent redirect to the existing matching `/sell-your-house-fast-{city}-nc` page; exact replacements, not homepage |
| `/testimonials`, `/recently-purchased-properties` | Unsupported proof pages | URLs retained, truthful replacement copy, `noindex,follow`; excluded from sitemap until supported proof exists |
| `/privacy` | Understand inquiry data handling | New privacy page; parent task must check against final implementation |
| `/reviews` | Feedback | Parent task owns; excluded from content sitemap because evidence was not supplied |

No existing canonical city or guide route was intentionally removed. Five duplicate city routes redirect in the existing dynamic route with Next.js `permanentRedirect` (308). RealEstateAgent markup and unverified page-level testimonial insertions were removed from the content pages. Accurate Article and Breadcrumb data remain; no review or aggregate rating markup is added.

The sitemap deduplicates paths, includes the three state hubs and new guide/offer/privacy routes, excludes noncanonical and unsupported proof pages, and uses the actual content revision date instead of a new last-modified timestamp on every request. Robots allow public crawling and disallow admin/API paths. Robots rules are not access control. Do not copy preview noindex rules into production.

## State and procedural source register

The following authoritative pages were checked through web search on September 5, 2026. The public pages link the relevant source next to the content. Content avoids specific deadline calculations or personalized legal conclusions.

- [North Carolina Judicial Branch: Estates](https://www.nccourts.gov/help-topics/wills-and-estates/estates): clerk/estate administration and the distinction for real property. Used in NC and inheritance content.
- [North Carolina Judicial Branch: Foreclosures](https://www.nccourts.gov/help-topics/housing/foreclosures): links to state process and homeowner resources. No blanket foreclosure deadline promised.
- [Georgia Courts directory](https://georgiacourts.gov/georgia-courts-directory/): route to the appropriate court.
- [Georgia.gov: Write a Will](https://georgia.gov/write-will): introductory executor/probate context; no assertion that all property follows the same estate process.
- [Supreme Court of Ohio: Decedent’s Estate Forms](https://www.supremecourt.ohio.gov/forms/all-forms/decedents-estate/8): official estate forms; applicability must be confirmed for the actual property.
- [CFPB: Mortgage Help](https://www.consumerfinance.gov/mortgagehelp/): independent mortgage and HUD-approved counseling resources; an offer inquiry does not pause proceedings.
- [CFPB: Mortgage assumption disclosure guidance](https://www.consumerfinance.gov/rules-policy/regulations/1026/18/): assumption conditions and due-on-sale context for questions to take to independent advisers.

## Next verification

TypeScript passed after the content changes. The parent task handles the integrated build, browser journeys, screenshots, release, and production evidence. Check all sitemap URLs and the five exact duplicate redirects against the deployed site. Confirm one H1, the intended canonical, successful status, focusable skip-link target, phone/SMS links, and parseable JSON-LD on each representative route. Preserve `public/google3b135227f2cfe181.html` and any existing verification metadata if present; no verification artifact was edited by this content task.

