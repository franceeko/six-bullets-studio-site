# UI and maintenance changelog

## 2026-10-28 — Defer below-fold stylesheets

- Removed the extra Team, Happy Town, FAQ and Contact stylesheets from the global bundle. A lightweight `IntersectionObserver` loads each stylesheet 500px before its section; unsupported browsers load them all. Existing global section rules keep initial server-rendered layout intact.
- Local Brotli comparison: global stylesheet fell from 20,939 to 17,217 bytes (3,722 bytes / 17.8% smaller). The split did not reduce the main JS bundle measurably; swapping motion imports saved under 0.1 KiB, so that experiment was discarded. Lighthouse's unused-JS and remaining unused-CSS estimates still require separate architectural work and a fresh run.
- `check:ci` passed (37 tests); `build:vercel` passed. Published as `dpl_4yVbou8qeswNBUPJ5G5kgaYo32mD`; production HTML and the core stylesheet returned HTTP 200, and the client bundle contains all four deferred section stylesheet URLs. The main CSS request remains render-blocking but is 17.8% smaller; unused CSS and JS estimates still need a fresh Lighthouse run. Main-JS modular import experiment showed under 0.1 KiB change and was discarded.

## 2026-10-28 — Mobile media loading and desktop shader budget

- Team video `src` and poster now wait until the Marpuf card is within 200px of the viewport. This removes the video and 16.9 KiB poster from the initial request path; the fixed portrait frame preserves layout. Production HTML confirms neither media URL is emitted initially.
- Desktop shader cap reduced from 450k pixels/60 fps to 300k/30 fps, and to 12 fps while scrolling. The ambient shader continues moving; per-second pixel work is about one third of the previous budget before accounting for device/GPU behavior.
- `check:ci` passed (35 tests), `build:vercel` passed. Mobile stage deployed as `dpl_23Q3bJLPRwLc7xa4ppKGm4zb535T`; desktop follow-up deployed as `dpl_9WPGGEaKbJgxbERK3gVR1gczoc5a`. Production returned HTTP 200 and the served shader bundle contains the new limits. Lighthouse has not been rerun; the blocking stylesheet and unused-JS/CSS findings remain unmeasured and unchanged.

## 2026-10-28 — Faster intro after Lighthouse audit

- Reduced the minimal intro hold and fade from 900 ms + 520 ms to 300 ms + 300 ms. This addresses the desktop Lighthouse finding that the intro wordmark incurred a 1.63 s LCP render delay while keeping the centered wordmark transition.
- Test-first regression check and full `check:ci` passed (35 tests); `build:vercel` passed. Published as `dpl_cAfFaYMZK9NVosmSkqAkdeCuYZ2G`; production alias returned HTTP 200. Lighthouse has not been rerun, so score and LCP improvements are not yet measured.

## 2026-10-28 — Smooth shader and portrait crop

- Shader now targets 60 fps with a 450k-pixel cap and one noise octave. Per-frame work is about one quarter of the previous 900k/two-octave profile, while per-second pixel work is estimated at half because the cadence doubled.
- Kept shader speed at 0.48. The member portrait crop is fixed in place while the inner image parallax moves inside an 18px bleed, so card rotation and pointer movement cannot expose empty edges.
- Test-first regression checks passed; full `check:ci` passed with 35 tests and `build:vercel` passed. Published as `dpl_5PyyotaNKmhRVGYUo65aSAe2YHoM`; verified production HTTP 200, new portrait crop markup, responsive image assets and shader constants.

## 2026-10-28 — Desktop shader and image follow-up

- Added 320px/400px variants for eight team portraits flagged by desktop Lighthouse; together with current 512px and high-DPR sources, estimated selected payload falls about 161 KiB for those eight images.
- Desktop WebGL now uses at most 900k pixels, 30 fps and two noise octaves; the time multiplier is 0.48 (4× its original 0.12 rate) so motion is easier to perceive with lower per-second work. Mobile/static profiles remain shader-free. Fallback now animates opacity only and stays still on coarse/narrow devices, addressing the reported background CLS source.
- Preloaded JetBrains Mono at low priority to shorten its CSS request chain. Local preview verified responsive preloads, poster and avatar candidate markup.
- `npm run check:ci` passed with 34 tests and `npm run build:vercel` passed. The supplied desktop report showed 0.011 CLS and high shader task durations; post-change Lighthouse/device measurements are still needed.
- Published as `dpl_5Mt9MXPnSURxRnNSANmv3nfmNkvk`; production and representative 320px/400px images returned HTTP 200.
- Follow-up after user reported imperceptible movement: verified the previous live bundle used 0.24, raised to 0.48, and republished as `dpl_EkNRvjmpLLd32eUCumFBoWvEXNLC`. Verified production HTTP 200 and live shader constants `0.48`, `9e5` pixel budget and `1e3/30` frame interval.

## 2026-10-27 — Mobile Lighthouse follow-up

- Reduced Zark's 512px portrait from 56.8 kB to 38.1 kB and Marpuf's poster from 31.7 kB (512×288) to 17.3 kB (384×216), about 32.4 kB less transferred for the two flagged resources.
- Added responsive high-priority preload for Happy Town key art. Static/mobile profiles skip WebGL module loading and initialization; desktop capable profiles retain the idle-loaded shader.
- Local production preview confirmed the responsive preload markup and new poster path. Baseline Lighthouse score was 94 (FCP 1.8 s, LCP 2.6 s, TBT 80 ms, CLS 0, Speed Index 3.6 s); rerun Lighthouse after publication to measure changes.
- Published as `dpl_4m6ncjwc4pYxGHw2NdMSGuyxfcCh`; production returned HTTP 200, included responsive preload markup, and served the optimized poster and portrait assets with HTTP 200.

## 2026-10-27 — Image delivery and initial rendering

- Added 832w responsive sources for Zark, Francez and Samuca; reduced Marpuf's poster from 640×360 to 512×288 WebP. Four cited resources total about 151.5 KiB versus Lighthouse's 318.7 KiB baseline when 832w sources are selected.
- Removed the 820 ms entrance delay from Hero's high-priority art teaser, preloaded Inter Tight Latin and emitted one CSS file for the single-page site.
- `npm run check:ci` passed with 30 tests; `npm run build:vercel` passed. Local production preview showed one stylesheet and expected resource hints. No post-fix Lighthouse run yet.

## 2026-10-27 — Defer WebGL background startup

- The root no longer imports the WebGL shader into the initial client chunk. A CSS-only version renders immediately; the shader module downloads and starts during browser idle time (with a 2.5 s deadline, or a 1.2 s timer fallback).
- Production build now emits `LiquidBackground` as a separate 6.90 kB chunk (2.84 kB gzip); initial JS chunk is 386.90 kB (125.30 kB gzip). CSS remains a single 88.90 kB file (23.66 kB gzip) so below-fold sections stay styled on first paint.
- `npm run check:ci` passed with 31 tests; `npm run build:vercel` passed. Published as `dpl_F2UKjuXCUBio2W1Efmsh6BSWVwfy`; production returned HTTP 200. Lighthouse has not been rerun, so the reported 57 KiB JS and 11 KiB CSS estimates are not confirmed as resolved.

## 2026-10-27 — Accessibility and Lighthouse review

- Marked Marpuf's muted looping portrait video decorative to assistive technology; name and role remain in adjacent text. Did not add empty captions to a silent visual.
- Confirmed production CSP uses a per-response script nonce and HTTPS responses include HSTS (`max-age=31536000; includeSubDomains`). Lighthouse's unsafe-inline fallback, HSTS preload and Trusted Types notes are hardening/compatibility suggestions; they need separate compatibility and domain-scope review.
- Lighthouse manual-check items remain review prompts. No keyboard/screen-reader session or new Lighthouse run was performed.
- `npm run check:ci` passed with 32 tests; `npm run build:vercel` passed. Published as `dpl_FcmUvEgP6GNVnT64H7jfYMN2Xfp5`; production returned HTTP 200 with CSP nonce and HSTS headers.

## 2026-10-27 — Audit maintenance

- Published production at `https://sixbullets.vercel.app`; verified public HTTP 200.
- Excluded Vercel-local metadata and config from Prettier after remote build evidence; workspace checks still validate Vercel settings.
- Installed lockfile dependencies and passed full CI checks/build. Audit found high advisories in Vite 8.3.2 and Zod 4.6.5, including the production dependency graph; npm blocked automated remediation with `EALLOWREMOTE`.
- Made `check:ci` read-only by removing its `prettier --write .` step. Formatting remains available through `npm run format` and CI checks formatting with `npm run format:check`.
- Added a workspace verification guard for the read-only CI script and clarified `check:ci` versus `check:fast` in README.
- Confirmed route and navigation behavior against current components: links target section headings; Contact scrolls to the document bottom; Footer has no navigation item.
- Confirmed 28 automated tests and workspace verification pass. TypeScript, lint, syntax check and build remain unverified because dependencies are not installed in this workspace.

## 2026-10-27 — Navigation and intro stabilization

- Simplified the intro to the centered “Six Bullets” wordmark; removed loader labels, corner text and decorative loading bars. Reduced-motion users do not get a scroll-blocking intro.
- Replaced inconsistent native smooth-anchor timing with cancellable eased scrolling. Rapid section clicks cancel the prior animation; manual scroll input interrupts the animation.
- Kept FAQ as its own section before Contact, moved the Contact anchor onto the actual Contact section, and retained footer as a separate target. Clicking Contact scrolls to the bottom, while its active-state target stays tied to Contact.
- Restored the active navigation underline and subtle wine-colored glow.
- Allowed Vite-injected style elements and WebSocket HMR only for loopback HTTP development URLs. The production CSP remains strict.
- Added regression tests for local-vs-production CSP and stable navigation/intro behavior.

## Existing design decisions preserved

- The liquid background remains native WebGL with a finite pixel budget and CSS fallback.
- The site retains the existing black/cream/wine visual identity, optimized responsive media, team content and project artwork.
- Production source maps remain disabled and no deployment is triggered by local validation scripts.
