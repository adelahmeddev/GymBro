# 1. Project Overview

## What it does

**GymBro** is a mobile-first, installable **PWA** that serves as an **educational workout guide** for gym members.

User journey (see `src/app/Router.tsx`, `src/features/`):

1. `Landing (/)` — animated welcome → enter full name (no password).
2. `Home (/home)` — greeting + list of workout splits.
3. `Splits (/splits)` — Push / Pull / Legs day cards.
4. `WorkoutDay (/ppl/:dayId)` — exercise checklist with progress bar, per-exercise checkbox, fixed "complete" CTA when all done.
5. `ExerciseDetails (/exercise/:id)` — video/poster hero, sets × reps × rest × difficulty, primary/secondary muscles, equipment, weight logger, rest timer, technique (setup / execution / breathing / ROM), common mistakes, coach tips.
6. `WorkoutComplete (/workout-complete)` — summary (exercises completed, duration, %).
7. `Dashboard (/dashboard)` — admin-style stats from Firestore (total users, active today, visits, completions).

PWA manifest description (`vite.config.ts:17`): *"Educational workout application for intermediate and advanced gym members"*.

## Target users

- Arabic-speaking (Egyptian dialect default), English secondary.
- Gym-goers following a Push-Pull-Legs split.
- Mobile browsers; benefits from installable PWA + offline caching.
- Single-user local experience; no coach accounts, no social features.

## High-level architecture (plain language)

- **Client-only SPA.** No custom backend. React renders everything in the browser.
- **Data-driven content.** Exercises, splits, workout days are static JSON (`src/data/`). UI text is never hardcoded; resolved via i18n keys (`src/localization/locales/*.json`).
- **Local-first storage.** Workout progress + weight logs live in `localStorage` (mostly prefixed `gymbro_`). Firestore + Analytics are **optional**: if `VITE_FIREBASE_API_KEY` + `PROJECT_ID` are missing, the app still fully works (`src/services/firebase.ts:15`, `hasConfig` guard).
- **Pseudo-identity, not auth.** "Login" = `crypto.randomUUID()` + name stored locally and best-effort in Firestore `users/{id}` (`src/services/userService.ts:21-37`). No Firebase Auth, passwords, or sessions.
- **PWA shell.** `vite-plugin-pwa` generates a service worker; Firestore reads use `NetworkFirst` cache (`vite.config.ts:37-46`).

## Tech stack (exact versions from `package.json`)

| Layer | Technology | Version |
|---|---|---|
| Language | TypeScript (`target ES2020`, `jsx: react-jsx`, `strict: true`) | `^5.9.3` |
| UI | React / React-DOM | `^19.2.8` |
| Routing | React Router DOM (`BrowserRouter`) | `^7.18.1` |
| Animation | Framer Motion | `^12.42.2` |
| i18n | i18next / react-i18next | `^24.2.3` / `^15.7.4` |
| Styling | Tailwind CSS / @tailwindcss/vite | `^4.3.3` |
| Backend (optional) | Firebase (app, firestore, analytics) | `^11.10.0` |
| Build | Vite / @vitejs/plugin-react | `^6.4.3` / `^4.7.0` |
| PWA | vite-plugin-pwa / workbox-window | `^1.3.0` / `^7.4.1` |
| Lint | ESLint | `^9.39.5` |
| Types | @types/react, @types/react-dom | `^19.2.17`, `^19.2.3` |

No test framework, no `test` script, no `*.test.*` / `*.spec.*` files.
