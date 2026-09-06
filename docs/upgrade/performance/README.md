# Mobile laboratory performance — September 5, 2026

Target: `https://redclaycap.com/`. Before release `dpl_F6p23Dd8zDrmBD3zMgoPjTyEQ7HU`; after release `dpl_8n4PzbhppCvAMYyH6wH3GHyjwStM`, commit `22d9111dd7d99c73d5819a443fc9bb9e83c22636`. Three independent fresh browser profiles for each release. No lead submissions, analytics credentials, calls, messages or production changes were involved in these audits.

| Sample | Performance | FCP | LCP | TBT | CLS | Transferred |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Before 1 | 98 | 1.341s | 1.998s | 102ms | 0 | 187,662 B |
| Before 2 | 94 | 1.444s | 1.524s | 283ms | 0 | 187,620 B |
| Before 3 | 97 | 1.428s | 1.500s | 185ms | 0 | 187,664 B |
| **Before median** | **97** | **1.428s** | **1.524s** | **185ms** | **0** | **187,662 B** |
| After 1 | 94 | 1.642s | 1.642s | 242ms | 0 | 190,192 B |
| After 2 | 95 | 1.504s | 1.600s | 225.5ms | 0 | 190,189 B |
| After 3 | 83 | 1.467s | 2.040s | 610.5ms | 0 | 190,210 B |
| **After median** | **94** | **1.504s** | **1.642s** | **242ms** | **0** | **190,192 B** |

Before/after median LCP was 1.524s/1.642s; CLS stayed 0. Every after-run LCP stayed below 2.5s and CLS below 0.1. This is **not a demonstrated speed improvement**: median score decreased 3 points, median LCP increased 118ms and median TBT increased 57ms. After-run score range 83–95 and TBT range 225.5–610.5ms show material variability; keep the slow sample rather than discarding it. Complete measurements, medians/ranges and settings-equality checks are saved in `comparison.json`.

All six reports have no runtime error or audit warnings. Baseline report 1 saved successfully, then the CLI returned a Windows temporary-profile cleanup EPERM. All subsequent samples use explicitly owned temporary profiles and exited successfully. This cleanup issue does not invalidate the saved audit measurements.

Lighthouse 13.4.1; Microsoft Edge Headless 152; Windows; Node 24.17.0. Fixed mobile settings: viewport 390 × 844, DPR 1, simulated network RTT 150ms, throughput 1638.4kbps, CPU slowdown 4×. Underlying emulation parameters are request latency 562.5ms, download 1474.56kbps and upload 675kbps. Full exact settings and browser versions are embedded in every JSON report; corresponding HTML reports are directly viewable. The six reports were compared programmatically: Lighthouse versions and the complete form-factor, screen-emulation, throttling-method and throttling settings match exactly.

These are simulated mobile lab results, not mobile field Core Web Vitals at the 75th percentile. Lighthouse TBT is not INP. No Search Console/CrUX field measurements were available for this audit. The shared workstation was doing concurrent development work; benchmark index ranged 942.5–1587 before and 813–908.5 after. The machine was not equally idle despite identical audit settings. This limits causal attribution; it does not justify dismissing the slower after results. Compare medians and ranges and repeat under an idle controlled host before attributing changes to code.

Transferred resources increased from approximately 183KiB to 186KiB (median +2,530 bytes). The after audit estimates about 50KiB of unused JavaScript. Remaining bottlenecks are main-thread style/layout and Next.js script work: the first after sample records 1.195s of style/layout work and a 644ms main-document task; the slow third sample includes a 484ms unattributable task plus a 467ms main-document task. These are observed diagnostics, not proof that the page alone caused the host variability. Reduce unnecessary client work and verify idle-host consistency before claiming improved interaction performance.

After-release measurements are complete against the public production URL. Deployment-specific Next.js resource query parameters in the after reports identify `dpl_8n4PzbhppCvAMYyH6wH3GHyjwStM`, confirming the intended release was measured.

Reproduction tooling is isolated under ignored `.tmp/lighthouse` (no project dependency changes). `.tmp/audit-mobile.mjs` runs an independent headless Edge instance using `.tmp/lighthouse-mobile.config.cjs`, saves JSON and HTML and shuts down only its own browser. For a future measurement, preserve these reports first; running `node .tmp/audit-mobile.mjs after 1` through sample 3 overwrites the corresponding output files.
