# Six Bullets Studio — Codex Instructions

## Output & Token Discipline

- Follow `caveman`, `token-saver-codex`, and `token-efficiency` rules on every turn.
- Be terse: output code, diffs, and direct conclusions only. Skip intros, recaps, and obvious explanations.
- Start here, then inspect only the target file and direct imports via `rg` or targeted line ranges.
- Never open binary media (`.png`, `.webp`, `.mp4`), lockfiles, `node_modules/`, `.vercel/`, build output, or `src/routeTree.gen.ts`.
- Never run `git status`, `git diff`, or `git log` across parent directories (`C:\Users\CLIENTE\.git` sits above this workspace); scope any git commands strictly to `.` or rely on `npm run check:fast`.
- Apply edits in a single clean pass (`surgical-patch`). Never re-read a file just written or run repo-wide formatting (`npm run format`) unless explicitly requested.

## Mission & Visual Direction

- Keep the site production-safe, fast, resilient, accessible, and visually polished.
- Preserve the existing Six Bullets visual language unless a redesign is explicitly requested.
- When creating or refining UI, apply `frontend-design`, `impeccable`, `tailwind-design-system`, and `web-design-guidelines`. Avoid generic AI aesthetics.

## Repository Map

- `src/routes/__root.tsx`: document shell, metadata, font preloads, global providers, intro, liquid background, error/404 screens.
- `src/routes/index.tsx`: homepage composition (`Hero`, `About`, `Team`, `Happy Town`, `FAQ`, `Contact`, `Footer`).
- `src/components/site/`: Hero, About, Happy Town, Team, FAQ, Contact, shared primitives.
- `src/components/layout/`: desktop nav, mobile dialog menu, intro, theme, footer, WebGL liquid background.
- `src/components/perf/`: local error boundaries.
- `src/lib/perf-profile.ts`: rendering budgets and device detection.
- `src/lib/error-capture.ts`: side-effect-free server error logging helpers.
- `src/lib/security-headers.ts`: CSP and response hardening headers.
- `src/server.ts` & `src/start.ts`: server response wrapper, error HTML, CSRF middleware.
- `src/data/`: navigation, studio links, and team records (keep data separate from presentation).
- `src/assets/index.ts`: typed media registry (`public/assets/team/`).
- `src/styles.css` + deferred section stylesheets: design system, responsive rules, animations, fallbacks.
- `scripts/verify-workspace.mjs` & `scripts/check-syntax.mjs`: fast workspace/parse checks.
- `src/routeTree.gen.ts`: generated; never hand-edit.

## Performance & PageSpeed (Target 95–100 Mobile & Desktop)

- Apply `core-web-vitals`, `performance`, `pagespeed-optimizer`, `vercel-optimize`, and `vercel-react-best-practices`.
- Keep global CSS lean; keep below-the-fold section stylesheets (`Team`, `Happy Town`, `FAQ`, `Contact`) deferred until 500px before viewport entry.
- Preload critical `.woff2` font files directly in `__root.tsx` to break the stylesheet→font waterfall.
- Keep intro hold/fade minimal (<= 300ms + 300ms, centered wordmark only) so it never delays Hero LCP.
- Defer WebGL shader initialization via `requestIdleCallback` / post-LCP scheduling and respect `src/lib/perf-profile.ts` (300k pixel / 30fps cap, 12fps while scrolling, pause `rAF` when hidden).
- Keep liquid background fallback layout-stable (`CLS = 0`).
- Keep Marpuf media deferred until 200px before viewport; size team WebP assets to match rendered card dimensions with intrinsic `width`/`height` and `srcset`/`sizes`.
- Animate `transform` and `opacity` only; avoid permanent `will-change` unless measured.

## Reliability, Security & Responsive

- Failed media or lazy sections must never take down parent sections or the page (use `src/components/perf/` boundaries).
- Keep section navigation anchors stable; preserve Tab-trap/Escape focus restoration on mobile menu and single-open FAQ accordion behavior.
- Apply `typescript-advanced-types` (strict TS, zero `any`) and security best practices: never expose secrets in client code or `public/`, keep production CSP strict (loopback exception only for local Vite HMR), keep production source maps disabled, and add `rel="noopener noreferrer"` to external new-tab links.
- Verify responsive layouts across `320x568`, `375x667`, `390x844`, `768x1024`, `1024x768`, `1280x720`, `1440x900`, `1920x1080`, and ultrawide using fluid sizing, `svh`/`dvh`, and safe-area insets.

## Validation (`verify-and-stop`)

Run the smallest check first, then `check:fast` or `check:ci` (read-only; never run `prettier --write` in CI):

```powershell
npm run check:fast
npm run build:vercel
```

Never claim a check or build passed without actually running it. Record notable maintenance changes in `UI_CHANGELOG.md`.
