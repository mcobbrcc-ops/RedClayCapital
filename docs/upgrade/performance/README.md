# Mobile laboratory performance — September 5, 2026

Baseline target: `https://redclaycap.com/`, production release `dpl_F6p23Dd8zDrmBD3zMgoPjTyEQ7HU`. Three independent fresh browser profiles. No lead submissions, analytics credentials, calls, messages or production changes were involved.

| Sample | Performance | FCP | LCP | TBT | CLS | Transferred |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Before 1 | 98 | 1.341s | 1.998s | 102ms | 0 | 187,662 B |
| Before 2 | 94 | 1.444s | 1.524s | 283ms | 0 | 187,620 B |
| Before 3 | 97 | 1.428s | 1.500s | 185ms | 0 | 187,664 B |
| **Before median** | **97** | **1.428s** | **1.524s** | **185ms** | **0** | **187,662 B** |

Each report has no runtime error or audit warnings. Baseline report 1 saved successfully, then the CLI returned a Windows temporary-profile cleanup EPERM. Samples 2 and 3 use explicitly owned temporary profiles and exited successfully. This cleanup issue does not invalidate the saved audit measurements.

Lighthouse 13.4.1; Microsoft Edge Headless 152; Windows; Node 24.17.0. Fixed mobile settings: viewport 390 × 844, DPR 1, simulated network RTT 150ms, throughput 1638.4kbps, CPU slowdown 4×. Underlying emulation parameters are request latency 562.5ms, download 1474.56kbps and upload 675kbps. Full exact settings and browser versions are embedded in every JSON report; corresponding HTML reports are directly viewable.

These are simulated mobile lab results, not mobile field Core Web Vitals at the 75th percentile. Lighthouse TBT is not INP. No Search Console/CrUX field measurements were available for this audit. The shared workstation was doing concurrent development work; benchmark index varied from 942.5 to 1587 and TBT variation is material. Compare three-run medians and ranges rather than asserting a small score change is a measured user improvement.

Baseline observations: transferred page resources are approximately 183KiB. The first sample estimates about 53KiB of unused JavaScript. The baseline already performs well for initial rendering; preserve that result and avoid adding unnecessary client JavaScript or unoptimized media.

After-release measurements: pending the verified new production deployment. Repeat the identical audit against the same public URL. Do not compare the baseline with a Next.js development server.

Reproduction tooling is isolated under ignored `.tmp/lighthouse` (no project dependency changes). `.tmp/audit-mobile.mjs` runs an independent headless Edge instance using `.tmp/lighthouse-mobile.config.cjs`, saves JSON and HTML and shuts down only its own browser. Invoke `node .tmp/audit-mobile.mjs after 1`, then samples 2 and 3, after the release owner confirms the production alias points at the verified upgrade.
