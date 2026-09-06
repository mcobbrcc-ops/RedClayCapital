# Public contact update

Application source: `2fc779d`. This followup preserves the company-focused design and existing page routes while changing public contact details to `(919) 588-3714` and `offers@redclaycap.com`.

The shared configuration drives page copy, native call/text links, Organization metadata, public intake error guidance, and the social image. Contact cards now place the number above distinct icon buttons, followed by a wrapping email row. Mobile footer clearance follows the actual action-bar height. Text enlargement also prompted min-width and wrapping corrections for long prose and headings.

Call and text taps remain intent events, separate from accepted form leads and inbound SMS. Optional analytics receives only approved placement and coarse acquisition categories; no arbitrary campaign labels, contact details, reply tokens or message bodies. Plain native SMS links are retained. No prefilled attribution claim or automatic lead creation is inferred from a tap.

Validation: 28 automated tests pass; the final production build passes, with the pre-existing legacy admin file-tracing warning. All 49 expected public routes pass the local SEO crawl, accounting for all 37 original sitemap URLs, five intended 308 redirects and the intended unknown 404. The responsive audit passes 24 normal/enlarged-text scenarios. Three accessibility audits score 100. See `qa-final.md` and the accompanying evidence for methods and real-device limitations.

A controlled owner-authorized message verified Google Voice-to-Gmail notification delivery and the original notification's displayed SPF/DKIM/DMARC results. This does not establish RCI SMS ingestion, owner-only notification delivery, or reply synchronization. Those remain separate integration gates coordinated with the canonical RCI task. Account-specific evidence is retained locally and is not part of this public report. No mailbox forwarding rule, OAuth grant, provider change or outbound reply was made.

Release uses the existing GitHub repository and Vercel project. Protected preview `dpl_2M3P7MaqgJh5Rr5Viy83tjg8SyfE` built application source 2fc779d. The prior production application is available at deployment `dpl_5HVD3ck6Rh6jQ28taXR48P2qiNPC` (source 8b90edd). Production deployment and HTTP verification are recorded after release; this document alone does not claim production completion.

## Production checkpoint

Application deployment dpl_9a8bbDniRq6HqeuphZSTBWqazr2Y is READY for source 2fc779dbc4274bd5e5da20690c3b66f515e8a993. Public North Carolina page DOM confirms the new number, native links, separated card and offers@redclaycap.com after reload. See production-crawl.json for the complete read-only route verification. No production forms, calls, SMS or email replies were sent.

Production crawl completed: 49 routes, 43 successful pages, five intended 308 redirects and one intended 404; no findings. Original sitemap coverage, canonical URLs and native contact destinations passed. Documentation-only evidence commits may create a subsequent deployment of the same application.
