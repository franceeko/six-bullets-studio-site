# Six Bullets Studio

Official website for the Six Bullets Roblox studio and its current project, Happy Town.

## Stack

- React 19 + TypeScript
- TanStack Start / Router
- Vite 8
- Tailwind CSS 4
- Framer Motion
- WebGL liquid background with adaptive performance tiers
- Bun lockfile, npm-compatible scripts

## Run locally

Requirements: Node 22.6+.

```powershell
npm install
npm run dev -- --host 127.0.0.1 --port 4173
```

Open `http://127.0.0.1:4173/`. Always run commands from the project root: the folder containing `package.json`.

## Checks

```powershell
npm run verify:workspace
npm run check:syntax
npm run lint
npm run typecheck
npm test
npm run build
```

Complete local gate:

```powershell
npm run check
```

Dependency vulnerability audit:

```powershell
npm run audit
```

## Project structure

- `src/components/layout/` — navigation, intro, theme, liquid background, footer.
- `src/components/site/` — Hero, About, Happy Town, Team and Contact.
- `src/components/perf/` — deferred mounting and section error boundaries.
- `src/data/` — editable studio, navigation, social and team content.
- `src/assets/` — typed runtime asset registry.
- `src/lib/` — error handling, security headers, performance and theme infrastructure.
- `src/routes/` — TanStack Start routes.
- `public/assets/team/` — original source media plus optimized runtime derivatives.
- `scripts/` — local syntax/workspace validation.
- `tests/` — performance, asset and security regression tests.
- `.vscode/settings.json` — workspace/editor settings only. Extension recommendations are intentionally not stored in the repository.
- `AGENTS.md` — rules for Codex-assisted development.

`src/routeTree.gen.ts` is generated. Do not hand-edit it.

## Performance and resilience

The site progressively degrades instead of taking the page down:

1. Adaptive WebGL on capable desktop hardware.
2. Lower pixel/frame budgets when hardware or runtime performance is limited.
3. CSS/SVG fallback for mobile, coarse pointers, reduced motion, weak GPUs or unavailable WebGL.
4. Optimized media with preserved original PNG fallbacks.
5. Section-level error boundaries so one lazy section cannot blank the entire page.
6. Route/server fallbacks with generic user-facing errors and no stack traces.
7. Visibility/lifecycle handling pauses expensive rendering while the page is hidden.

## Security model

A public client application cannot hide its shipped HTML/CSS/JS from visitors, so frontend files must never contain secrets.

Production responses include CSP, clickjacking protection, MIME sniffing protection, restrictive referrer/permissions policies, COOP/CORP and HSTS on HTTPS. Production source maps are disabled. Server failures return generic HTML instead of stack traces.

Never place API keys, private tokens or credentials in `src/` or `public/`. Use server-side deployment environment variables for secrets.

## Codex workflow

Read `AGENTS.md` first. VS Code search/watch excludes generated files, dependencies, lockfiles and binary media so Codex has less irrelevant context to process.

```powershell
npm install
npm run verify:workspace
npm run check:fast
npm run dev
```
