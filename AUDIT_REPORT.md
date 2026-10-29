# Six Bullets Studio — Technical Audit

Updated: 2026-10-28

Latest follow-up: moved Team, Happy Town, FAQ and Contact supplemental stylesheets out of the global stylesheet and load each 500px before its section enters view. The global stylesheet fell from 20,939 to 17,217 Brotli bytes (3,722 bytes / 17.8% smaller). Existing global rules retain the first viewport; section-specific refinements load before normal scrolling reaches those sections. `check:ci` passed (37 tests), production build passed. Deploy `dpl_4yVbou8qeswNBUPJ5G5kgaYo32mD` is READY and aliased to production; HTML and core CSS returned HTTP 200, the client bundle includes all four deferred stylesheet URLs, and the initial HTML still omits Marpuf media. The global stylesheet still render-blocks; the unused-CSS estimate is not fully removed. The main-JS bundle did not materially shrink from a motion import experiment, which was discarded; further JS reduction would require changing the page's SSR hydration/animation architecture. Lighthouse must be rerun to measure these changes.

Previous follow-up: delayed Marpuf video/poster until within 200px of viewport to remove 16.9 KiB poster and video request from initial mobile load; reduced the desktop shader budget to 300k pixels/30 fps (12 fps while scrolling). Deployment `dpl_9WPGGEaKbJgxbERK3gVR1gczoc5a` is READY; production returned HTTP 200 and initial HTML omitted video and poster.

Previous follow-up: shortened the minimal intro hold and fade from 900 ms + 520 ms to 300 ms + 300 ms after Lighthouse attributed a 1.63 s desktop LCP render delay to the intro wordmark. Deployment `dpl_cAfFaYMZK9NVosmSkqAkdeCuYZ2G` was verified on production.

## Summary

Six Bullets Studio is a single-page, server-rendered marketing site for an independent Roblox studio and its game, Happy Town. The app uses React 19, TypeScript, TanStack Start/Router, Vite 8, Nitro, Tailwind CSS 4 and Framer Motion. Vercel is the configured deployment target; production is live at [sixbullets.vercel.app](https://sixbullets.vercel.app). The site has one `/` route; the other destinations are in-page anchors.

## Structure and behavior

- `src/routes/__root.tsx` defines document metadata, global motion providers, the intro, liquid background, error and not-found screens. `src/routes/index.tsx` composes the homepage.
- Homepage order: Hero, Studio/About, Team, Happy Town, FAQ and Contact, followed by Footer.
- `src/components/layout/` contains desktop navigation, mobile dialog menu, intro, footer and WebGL background. `src/components/site/` contains page sections and shared section primitives. `src/data/` holds navigation, studio links and team records; `src/assets/index.ts` holds typed media paths.
- Navigation uses geometry-based active state and cancellable eased scrolling. Contact intentionally scrolls to document bottom. Mobile menu traps Tab, closes on Escape and restores focus. FAQ is an animated single-open accordion.
- Team portraits and project art have error fallbacks. Project art has responsive WebP sources; team images are lazy. The hero art is high priority. Marpuf has a muted looping video and poster.
- `src/server.ts` wraps server responses with security headers and generic server-error HTML. `src/start.ts` enables CSRF middleware for server functions. Production source maps are disabled.

## Commands

- `npm run dev`: local Vite development server.
- `npm run check:ci`: workspace, syntax, format, lint, type and test checks; read-only.
- `npm run check:fast`: same core checks without Prettier check.
- `npm run build:vercel`: typecheck and production Vite build.
- `npm run deploy:vercel`: production deployment to Vercel.
- `npm run format`: explicitly rewrites formatting. Do not use as a CI check.
- Production `HEAD /` returned HTTP 200 without credentials after deployment.

## Confirmed strengths

- Workspace verification passes and all 28 current tests pass.
- Asset registry paths resolve to files under `public/assets/team/`.
- Tests cover CSP differences, nonce streaming, caching headers, asset existence, responsive hero CSS, reduced motion and navigation targets.
- Marpuf's portrait is a muted decorative loop; its name and role appear as adjacent text. It is hidden from assistive technology, so no empty captions were added. Keyboard/screen-reader review still requires manual testing.
- Latest user-supplied mobile Lighthouse baseline: performance 94, accessibility 100, best practices 100, SEO 100; FCP 1.8 s, LCP 2.6 s, TBT 80 ms, CLS 0, Speed Index 3.6 s. Lighthouse reported 33 KiB image savings, 450 ms render-blocking CSS, 56 KiB unused JS, 11 KiB unused CSS, and 159/97 ms long tasks in the initial/shader bundles. This is a lab run; the report showed no field data.
- Latest desktop Lighthouse diagnostics flagged 8 team portraits (about 154.5 KiB estimated image savings), a 395 ms stylesheet→font chain, 0.011 CLS attributed to the liquid fallback, and 20 long tasks during a 27.2 s main-thread window, including shader tasks up to 220 ms. Treat the long-task total as that emulated lab capture, not field-user data.
- CSP permits Vite style injection and WebSocket HMR only on loopback HTTP; production stays stricter. Server errors are not rendered with stack traces.
- Main stylesheet includes keyboard focus styling, reduced-motion rules, responsive breakpoints and `svh` sizing. Hero and project media include intrinsic dimensions.
- External social links opened in a new tab use `rel="noopener noreferrer"`.

## Findings and limits

### Confirmed

- `check:ci` previously ran `prettier --write .` before its checks. CI could silently modify the checkout. Changed it to run verification and `prettier --check` without writing. Use `npm run format` explicitly when formatting is intended.
- Workspace verification now guards this property, and README distinguishes `check:ci` from `check:fast`.
- Vercel's remote `check:ci` included generated `.vercel/static-build/package-manifest.json` and reported a `vercel.json` formatting mismatch despite local checks passing. `.vercel` and `vercel.json` are excluded from Prettier; workspace verification still parses and checks deployment settings. Final remote build passed.
- `UI_CHANGELOG.md` did not record the current maintenance state. Added a dated entry with verified navigation and validation status.
- Git metadata is rooted at `C:\Users\CLIENTE\.git`, above the workspace. Git reports `C:\Users\CLIENTE` as its root, so a workspace-only diff/status cannot be trusted. No Git mutations were made; this report and package/changelog edits are confined to the workspace.
- `npm ci` installed 256 lockfile packages. `npm audit --omit=dev` still reports two high-severity advisories: Vite 8.3.2 and transitive Zod 4.6.5, both under TanStack Start's dependency tree. `npm audit fix --dry-run` was blocked with `EALLOWREMOTE` while fetching `@tailwindcss/oxide-wasm32-wasi@4.3.3`; dependency versions were not changed. No vulnerable request path was confirmed in the generated server bundle, but dependency findings remain open.
- Vercel generated ignored project/build metadata and `.env.local` during linking. Secret values were not read or included in this report.

### Needs follow-up evidence

- Eater uses the `rex.webp` avatar entry. This may be intentional shared artwork; no authoritative reference was present to verify a mismatch.
- Theme provider/context files exist but are not mounted or referenced by the current route. Startup theme script always selects dark mode and there is no current theme switch. This looks like dormant infrastructure; removal should wait until product intent is confirmed.
- `deploy/cloudflare-pages/_headers` exists while Vite and workspace checks configure Vercel/Nitro only. No deployment pipeline or usage was available to establish whether this file is stale.
- No visual browser review was available. Local production preview verified server-rendered links, font preloads, responsive image candidates and single stylesheet; viewport rendering, interaction and browser console remain unverified.
- User-provided Lighthouse runs reported image savings, render-blocking CSS, unused JavaScript/CSS and main-thread work. Mobile baseline is 94 with zero CLS; field data is unavailable. Image candidates now target the 320/400/512/832/1024 widths implicated by desktop card sizes, with local candidate selection for the 8 flagged portraits saving about 161 KiB before transfer compression. Marpuf's poster remains 14.1 KiB smaller than its prior 512px version. The LCP image has a responsive preload; JetBrains Mono is preloaded at low priority to shorten the CSS→font chain. Mobile/static profiles still skip WebGL. Desktop shader now renders at max 0.45 MP/60 fps with one noise octave and a 0.48 time multiplier (4× original speed); per-frame work is estimated at one quarter of the previous desktop setting and per-second work at one half, assuming linear scaling. Portrait parallax now moves inside a stationary 18px-bleed crop viewport to prevent exposed gaps. CSS fallback animates opacity rather than geometry and is static on coarse/narrow devices. CSS remains one file at 23.66 kB gzip; below-fold rules remain necessary when scrolling. No post-change Lighthouse or device profiling has yet measured these changes.

## Quality status

| Check                                        | Result                                                           |
| -------------------------------------------- | ---------------------------------------------------------------- |
| `npm run verify:workspace`                   | Passed                                                           |
| `npm test`                                   | Passed: 30 tests                                                 |
| `node --check` on both `.mjs` scripts        | Passed                                                           |
| `package.json` JSON parse                    | Passed                                                           |
| `npm run check:ci`                           | Passed: workspace, syntax, format, lint, TypeScript and 35 tests |
| `npm run build:vercel`                       | Passed; shader emitted as deferred chunk, one stylesheet         |
| Vercel production build                      | Passed; `dpl_5PyyotaNKmhRVGYUo65aSAe2YHoM` is `READY`            |
| `curl.exe -I https://sixbullets.vercel.app/` | HTTP 200; optimized assets returned HTTP 200                     |
| `npm audit --omit=dev`                       | 2 high findings in production dependency graph                   |
| Browser/responsive review                    | Not run; no browser available                                    |
| Git status/diff                              | Unreliable: Git root is parent user directory                    |

Node.js 24.15.0 is present and satisfies the declared `>=22.12.0` requirement. `package-lock.json` exists; registry and dependency installation were not tested. No dependency was added or removed. Package declares React 19, TanStack Start/Router, Vite, Nitro, Tailwind, Framer Motion and icon/font packages. Lockfile pins the dependency graph; workspace verification checks TanStack Start/server-core minimum versions and exact Nitro pin.

## Priorities

1. **Required before merge/release:** restore a Git repository boundary at the project or workspace parent intentionally, then review a scoped diff. Current Git root exposes unrelated user files to status output.
2. **Security follow-up:** update Vite/Zod to advisory-fixed lockfile versions when package-fetch policy permits, then rerun `npm audit`, `check:ci` and build.
3. **Visual follow-up:** inspect browser behavior at required viewports; no browser review or performance measurements were available here.
4. **Clarify before cleanup:** verify Eater's portrait source and whether theme switching or Cloudflare deployment remains a supported target.
5. **Optional:** collect representative mobile/desktop performance measurements before changing shader or animation budgets.

## Changes in this audit

- Removed the write-format step from `check:ci`; formatting checks are now read-only in CI.
- Added a workspace guard against reintroducing write-format behavior in CI and clarified validation commands in README.
- Excluded Vercel metadata and deployment config from Prettier after remote build evidence; retained structural config checks.
- Linked and deployed to Vercel. Two attempts failed on remote formatting checks; the final deployment passed and the production alias returned HTTP 200.
- Added 832w responsive variants for the three oversized team portraits and a 512w compressed Marpuf poster. Kept responsive dimensions in width-based `srcset` candidates.
- Removed the Hero teaser's 820 ms entrance delay, preloaded Inter Tight Latin, and bundled root/section CSS into one stylesheet while preserving cascade order.
- Deferred WebGL shader download/startup until browser idle, retaining its CSS fallback for initial rendering.
- Verified production build splits the 6.90 kB shader module from the 386.90 kB initial JS chunk. Published as `dpl_F2UKjuXCUBio2W1Efmsh6BSWVwfy`; production alias returned HTTP 200. Post-fix Lighthouse was not run; its unused-code estimates remain unverified.
- Marked the silent looping portrait video decorative to assistive technology; name and role remain visible as text. Confirmed HTTPS responses already include CSP nonce and HSTS headers. No Trusted Types or HSTS preload policy was added without compatibility and subdomain-scope validation. Published as `dpl_FcmUvEgP6GNVnT64H7jfYMN2Xfp5`; production returned HTTP 200.
- Compressed Zark's 512px portrait from 56.8 kB to 38.1 kB and replaced Marpuf's 512×288 poster with a 384×216 WebP at 17.3 kB, down from 31.7 kB. Added a responsive preload for the hero key art and skipped the deferred WebGL module for profiles already classified as static (coarse pointer, narrow viewport, reduced motion, Firefox or no GPU). Published as `dpl_4m6ncjwc4pYxGHw2NdMSGuyxfcCh`; production returned HTTP 200, emitted responsive preload markup and served both optimized assets with HTTP 200. Post-change Lighthouse is still needed to quantify the effect.
- Added 320px and 400px responsive derivatives for all eight desktop-flagged portraits and kept the existing 512px and high-DPR candidates. Local audit estimates about 161 KiB less image payload for the flagged desktop candidate choices.
- Reduced desktop shader work to a 0.9 MP canvas budget, 30 fps, two noise octaves, and doubled the slow time multiplier so the movement remains visible. The CSS fallback now breathes through opacity (no transform-based shift) and stays still on coarse/narrow screens.
- Preloaded JetBrains Mono at low fetch priority to break the stylesheet-to-font request chain. Local production preview verified all responsive preload and avatar candidate markup.
- Published as `dpl_5Mt9MXPnSURxRnNSANmv3nfmNkvk`; production returned HTTP 200 and served the responsive avatar variants and poster with HTTP 200. Post-deployment Lighthouse is still needed to quantify lab performance changes.
- After confirming the live shader carried the prior 0.24 clock, raised it to 0.48 (4× the original rate) while preserving the 900k-pixel/30fps/two-octave budget. Latest deployment `dpl_EkNRvjmpLLd32eUCumFBoWvEXNLC` is READY; live bundle returns HTTP 200 and contains `0.48`, `9e5`, and `1e3/30`.
- Reduced the shader again for smoother cadence: 450k pixel cap, 60 fps, one noise octave, with the 0.48 clock retained. Fixed portrait bleed by moving the parallax layer inside a stationary overflow crop with 18px inset. `check:ci` passed with 35 tests and production build passed. Published as `dpl_5PyyotaNKmhRVGYUo65aSAe2YHoM`; production returned HTTP 200, rendered the fixed crop markup and served representative responsive assets with HTTP 200. Live shader bundle contains the 0.48 clock, 450k budget (`45e4`) and 60fps interval.
- Updated `UI_CHANGELOG.md` with the maintenance and verification state.
- Replaced this report with a code- and command-verified audit summary.

No design, copy, team membership or runtime behavior was changed. Dependency versions stayed unchanged because npm rejected the advisory fix fetch.
