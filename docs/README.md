# GymBro — Documentation Index

Comprehensive deep-dive docs for the GymBro codebase (`D:\GymBro`, branch `master`).
All statements are grounded in the actual files. Where something does not exist (tests, backend API, CI), that is stated explicitly.

## Files

| File | Contents (§ of original request) |
|---|---|
| `01-OVERVIEW.md` | §1 Project Overview + tech stack with versions |
| `ARCHITECTURE.md` | §2 Architecture & structure, data flow, patterns, diagram |
| `SETUP.md` | §3 Setup & installation, env vars, tests |
| `MODULES.md` | §4 Core modules / components (functions, signatures, examples) |
| `API.md` | §5 App routes + Firestore + Analytics (no custom REST API exists) |
| `DATABASE.md` | §6 Firestore + localStorage schema, ER diagram |
| `DEPLOYMENT.md` | §7 Configuration & deployment |
| `TECHNICAL-DEBT.md` | §8 Known issues, TODOs & technical debt |
| `GLOSSARY.md` | §9 Glossary |

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173/
npx tsc --noEmit   # typecheck
npm run build      # tsc -b && vite build → dist/
npm run preview
```

Copy `.env.example` → `.env` to enable Firebase (optional; app works fully offline without it).
