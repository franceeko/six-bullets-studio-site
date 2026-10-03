# Six Bullets Studio — Codex project instructions

## Mission
Keep the site production-safe, fast, resilient, responsive, accessible and visually polished. Preserve the existing Six Bullets visual language unless a redesign is explicitly requested.

## Repository map
- `src/routes/index.tsx`: page composition and section mounting.
- `src/routes/__root.tsx`: document shell, metadata, providers and route errors.
- `src/components/site/`: Hero, About, Happy Town, Team, Contact.
- `src/components/layout/`: navigation, intro, theme, footer, liquid background.
- `src/components/perf/`: deferred mounting and local error boundaries.
- `src/lib/perf-profile.ts`: rendering budgets and device detection.
- `src/lib/error-capture.ts`: side-effect-free server error logging helpers.
- `src/lib/security-headers.ts`: response hardening headers.
- `src/data/`: editable content and links.
- `src/assets/index.ts`: typed media registry.
- `src/styles.css`: design system, responsive rules, animations and fallbacks.
- `scripts/verify-workspace.mjs`: cheap workspace sanity checks.
- `scripts/check-syntax.mjs`: TypeScript/JS parse check.
- `src/routeTree.gen.ts`: generated; never hand-edit.

## Codex context economy
1. Start with `AGENTS.md`, then inspect only the target component and direct imports.
2. Do not open PNG, WebP, MP4, lockfiles, `node_modules`, build output or generated route files unless required.
3. Prefer `rg`, targeted reads and symbol navigation over directory dumps.
4. Do not run repository-wide formatting for a local change unless requested.
5. Codex is the primary coding agent; do not add another AI/autocomplete stack without a concrete need.

## Performance
- Prefer transform/opacity animations over layout-triggering properties.
- Pause `requestAnimationFrame` loops when hidden or unavailable.
- Never assume WebGL, high DPR, fast GPU or desktop input.
- Keep media lazy and responsive with `srcset`/`sizes` where useful.
- Preserve original source media; runtime derivatives must remain visually acceptable.
- Avoid permanent `will-change` unless measured.
- Avoid unnecessary third-party requests.

## Reliability
- A failed image/video must not take down its section.
- A failed lazy section must not take down the entire page.
- Server errors must not expose stack traces to visitors.
- Preserve WebGL context recovery, mobile/CSS fallback, reduced-motion behavior and native cursor behavior.
- External links opened in new tabs require `noopener noreferrer`.

## Security
- Never put secrets, API keys or private tokens in client code or `public/`.
- Do not weaken CSP/security headers to make a feature convenient; adjust the implementation instead.
- Keep production source maps disabled unless there is a documented operational reason.
- Keep user-facing error pages generic and detailed errors server-side only.

## Responsive requirements
Check at 320x568, 375x667, 390x844, 768x1024, 1024x768, 1280x720, 1440x900, 1920x1080 and ultrawide widths. Use fluid sizing, safe-area insets, `svh`/`dvh`, wrapping layouts and intrinsic media dimensions.

## Code quality
- Keep strict TypeScript and existing alias conventions.
- Keep data separate from presentation.
- Reuse existing primitives before adding dependencies.
- Do not silently change team membership, public URLs, branding or copy.
- Never hand-edit `src/routeTree.gen.ts`.

## Validation
Run the smallest relevant check first, then the full local suite when dependencies are installed:

```powershell
npm run verify:workspace
npm run check:syntax
npm run lint
npm run typecheck
npm test
npm run build
```

Never claim a build or typecheck passed without actually running it.
