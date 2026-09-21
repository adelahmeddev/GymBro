# 7. Configuration & Deployment

## 7.1 Config files

| File | Controls |
|---|---|
| `vite.config.ts` | `@` alias; `react()`, `tailwindcss()`, `VitePWA({registerType:autoUpdate, includeAssets:[favicon, icons], manifest:{name 'GymBro - Your Workout Guide', theme/background #0f0f0f, standalone, portrait}, workbox:{globPatterns:['**/*.{js,css,html,json,svg}'], runtimeCaching:[firestore NetworkFirst, 50 entries / 86400s]} })` |
| `tsconfig.json` | Strict build gate (`npm run build` fails on type errors; `noUnusedLocals/Parameters`, `noFallthroughCasesInSwitch`, `noUncheckedIndexedAccess`) |
| `index.html` | `lang=ar dir=rtl`, theme-color `#0f0f0f`, title `GymBro`, module entry |
| `src/index.css` | Tailwind v4 `@theme`: surfaces `#0f0f0f/#1a1a1a/#242424/#2a2a2a`, borders, text, `accent #e63946 → hover #c5303c`, success/warning/error/info/gold; utilities `safe-top/bottom`, `text-gradient`, `card-hover`, `glass` |
| `public/_headers` | `X-Content-Type-Options: nosniff`; `/exercises/* → image/gif`; `/icons/* → image/png`; `/assets/* → immutable 1y` (Cloudflare Pages syntax) |
| `.env` (untracked) / `.env.example` | 7 Firebase vars (see `SETUP.md`) |
| `package.json` scripts | `dev: vite`, `build: tsc -b && vite build`, `preview: vite preview`, `lint: eslint .` |

PWA manifest: `name: GymBro - Your Workout Guide`, `short_name: GymBro`, `display: standalone`, `orientation: portrait`, icons `/icon-192.svg`, `/icon-512.svg`.

## 7.2 Deployment

- **Target (evidenced by git history + `_headers`): Cloudflare Pages static hosting.** Commits: `Remove wrangler.toml… framework auto-detection`, `Fix Cloudflare build failure: remove gif/png/jpg from workbox globPatterns (12.6MB precache)`, `Add Cloudflare Pages _headers`, `Replace PNG icons with root-level SVGs`.
- **Artifact:** `npm run build → dist/` (gitignored). No `Dockerfile`, no `wrangler.toml` (deleted), no `.github/workflows`, no Netlify/Vercel config.
- **Environments:** no dev/staging/prod differentiation in code. Same bundle; behavior varies only by `.env` (local) / Pages env vars (hosted) → `hasConfig` on/off.

|  | Dev (`npm run dev`) | Prod (Pages) |
|---|---|---|
| Serving | Vite dev server, HMR | Static `dist/`, SW `autoUpdate` |
| Firebase | `.env` file (optional) | Pages environment variables |
| Media | R2 MP4 + local GIF | Same; SW precaches js/css/html/json/svg (media excluded) |
| Firestore cache | N/A (no SW) | Workbox `firestore-cache` NetworkFirst |
