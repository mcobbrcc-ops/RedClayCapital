# Contact update: final local QA

Final local production build: `Qg1FiACehIlbGWRBNSs0P` at http://127.0.0.1:3100. All results below are from the same completed build after the wrapping fixes.

- **24/24 layout scenarios passed:** Contact and North Carolina at actual widths 320, 375, 390, 430, 768, and 1440, each with normal text and 200% enlarged text.
- **Contact targets:** smallest measured target was 49px wide and 44px high. Call/Text buttons remained separated by at least 12px. Email wrapping and destination checks passed.
- **No horizontal overflow:** checked both element and text-range geometry, including content that could otherwise be hidden by overflow clipping.
- **Sticky controls:** body bottom padding exceeded the visible action-bar height by at least 8px. At 320/375px, enlargement increased the bar from 69px to about 125.4px and padding from 77px to 134px. Desktop/tablet cases correctly hid the mobile bar.
- **Accessibility:** Contact, North Carolina, and the offer page each scored 100 in the final Lighthouse accessibility audit, with no failed checks or warnings.
- **Contact configuration:** display `(919) 588-3714`, call `tel:+19195883714`, text `sms:+19195883714`, email `offers@redclaycap.com`, checked against `lib/public-contact.json`.

Inspected the final desktop screenshot (1440×1000), narrow mobile screenshot (320×844), and enlarged-text mobile screenshot. The contact choices are distinct, the number is prominent, and the email wraps without clipping. The final screenshots are actual viewport captures after scrolling to the contact card or enlarged actions; they are not document-region crops.

Evidence:

- `qa-summary.json`: build ID, source fingerprints, aggregate measurements, and screenshot dimensions/hashes.
- `responsive-contact-final.json`: full measured geometry and results for all 24 conditions.
- `accessibility/*.report.json` and `*.report.html`: final accessibility reports.
- `screenshots/contact-card-mobile.png` and `screenshots/contact-card-desktop.png`: inspected mobile/desktop views.
- `screenshots/final-*-text200.png`: enlarged-text views.

The 200% condition is an isolated laboratory text-only enlargement: computed font sizes and numeric line heights are doubled in a disposable test document. It is separate from device/browser zoom testing. Lighthouse scores do not replace manual keyboard or real-device checks. No call, text, email, or lead submission was initiated. No mail content was used in these audits.

Earlier narrow-width wrapping findings were fixed and retested; initial artifacts are superseded for acceptance. Prior-release evidence in `docs/upgrade` remains unchanged. This report verifies local QA, not production deployment or contact delivery.
