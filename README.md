# Six Bullets Studio

Official website for Six Bullets Studio and its current project, Happy Town.

## Stack

- React 19, TypeScript, TanStack Start/Router
- Vite 8, Tailwind CSS 4, Nitro for Vercel
- Framer Motion for restrained interface motion
- Native WebGL/GLSL liquid backdrop with a CSS fallback
- Optimized WebP portraits and project artwork

## Requirements

- Node.js 22.12 or newer
- npm
- Vercel CLI access to publish production builds

## Run locally (PowerShell)

```powershell
npm ci
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173/`). Keep the terminal running while testing. Local development allows Vite-injected style elements only for loopback HTTP URLs; production CSP remains restrictive.

## Validate before publishing

```powershell
npm run check:ci
npm run check:fast
npm run build:vercel
```

`check:ci` runs workspace verification, source syntax checks, formatting checks, ESLint, TypeScript and automated tests without rewriting files. `check:fast` runs the same core checks without the formatting check. The production build must also pass before deploying.

## Publish to Vercel

Production: <https://sixbullets.vercel.app>

```powershell
npx vercel login
npx vercel link --scope six-bullets --project sixbullets
npm run deploy:vercel
```

The deploy command publishes to production. Do not deploy until the local layout, navigation, mobile menu and media have been checked. The normal `npm run deploy` script is also configured to target Vercel.

## Project map

- `src/components/layout/` — navigation, minimal intro, WebGL background, footer and mobile menu
- `src/components/site/` — Hero, Studio, Team, Happy Town, FAQ and Contact
- `src/components/perf/` — section error boundary
- `src/data/` — navigation, studio, team and social content
- `src/assets/index.ts` — typed media registry
- `src/lib/` — security headers, performance profile, error handling and theme infrastructure
- `src/routes/` — TanStack Start route composition
- `public/assets/` — public optimized media
- `scripts/` and `tests/` — project checks and regression tests
- `AGENTS.md` — guidance for AI-assisted changes

`src/routeTree.gen.ts` is generated. Do not hand-edit it.

## Visual and reliability notes

- The intro intentionally shows only the centered “Six Bullets” wordmark and exits quickly.
- Navigation anchors use a cancellable eased scroll animation; reduced-motion users get immediate scrolling. Contact scrolls to the bottom of the page and remains a real section target for active navigation state.
- The liquid shader keeps a finite pixel budget and pauses when the document is hidden.
- Production CSP does not permit inline style elements. The local-only relaxation is restricted to loopback HTTP so Vite can inject CSS during development.
- Never commit `.env` files, credentials, private tokens, or deployment secrets.
