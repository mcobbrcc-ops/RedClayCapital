# Final local responsive geometry — September 5, 2026

The homepage and offer page passed **12 of 12** width checks against the local production build. Each run measured the actual rendered page through a custom read-only Lighthouse gatherer; requested emulation settings alone were not accepted as evidence.

| Requested and observed window width | Document client width | Document scroll width | Home | Offer |
| ---: | ---: | ---: | --- | --- |
| 320 | 320 | 320 | Pass | Pass |
| 375 | 375 | 375 | Pass | Pass |
| 390 | 390 | 390 | Pass | Pass |
| 430 | 430 | 430 | Pass | Pass |
| 768 | 753 | 753 | Pass | Pass |
| 1440 | 1425 | 1425 | Pass | Pass |

All runs show zero document horizontal overflow and zero visible overflowing elements. The 15px desktop difference is the vertical scrollbar, not a viewport mismatch. The mobile runs use overlay scrollbars. Both actual DOM window measurements and Chrome DevTools Protocol layout measurements are saved in `responsive-final.json`, including control rectangles and native screenshot paths.

Method: Lighthouse 13.4.1, Edge 152, fresh isolated headless browser profile for each run, only the custom responsive geometry audit, no performance category, no form interaction, no selected in-app browser manipulation. Mobile emulation is enabled below 768px; desktop emulation is used at 768 and 1440px; DPR is 1. All twelve audits completed successfully. This is local geometry evidence, separate from keyboard, form, browser-back, zoom and physical-device interaction tests.

Native viewport PNGs are retained as `screenshots/final-home-320.png`, `final-home-390.png`, `final-home-1440.png`, `final-get-offer-320.png`, and `final-get-offer-1440.png`. Canonical comparison images `after-mobile.png` and `after-desktop.png` are copies of the final homepage 390 × 812 and 1440 × 990 native captures. The initial baseline files named `before-mobile.png` and `before-desktop.png` contain JPEG data at 375 × 812 and 1425 × 990 respectively; their content capture excludes the scrollbar. They were preserved untouched. Compare the requested viewport and content rather than assuming identical image pixel bounds.

The 320px and desktop screenshots were visually inspected: no horizontal clipping was observed, and the main heading, action and contact paths remain legible. Screenshots cover the initial viewport; full-page geometry covers the document. Initial-viewport screenshots do not prove every scrolled interaction works.

Final scope checkpoint: after the final privacy-link/new-tab-label and notice-text rebuild, the offer page was retested at 320px. Actual inner/client/scroll widths were all 320, no visible overflow elements were found, and the custom audit passed. Its record and native 320px screenshot replace the earlier offer320 sample; the unchanged remaining eleven width checks remain valid. The offer-page automated accessibility audit was also repeated and scored 100 with zero failed audits or warnings. No form submission occurred.
