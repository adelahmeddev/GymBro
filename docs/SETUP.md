# 3. Setup & Installation

## 3.1 Prerequisites

| Need | Details |
|---|---|
| Node.js + npm | Recent LTS that runs Vite 6. No `.nvmrc` / `engines` field in repo. |
| Browser | Modern Chromium/Safari/Firefox (PWA, `AudioContext`, `crypto.randomUUID`, `100dvh`). |
| Firebase account | **Optional.** Only for cloud persistence + Dashboard numbers. App is fully usable without it. |
| R2 CDN | No key needed; MP4/poster URLs are public (`https://pub-585d42eb...r2.dev/...`). |
| OS note | `start.bat` is Windows-only. `scripts/*.py` need Python + `imageio[ffmpeg]` + `curl.exe` (asset tooling only). |

## 3.2 Step-by-step local setup

```bash
# 1. clone
git clone <repo-url>
cd GymBro

# 2. install
npm install

# 3. configure (optional — skip for offline/local mode)
copy .env.example .env
# macOS/Linux: cp .env.example .env
# then fill values (see §3.3)

# 4. typecheck
npx tsc --noEmit

# 5. dev server
npm run dev
# → http://localhost:5173/
# Windows alternative: start.bat  (npx vite --host --port 5173)

# 6. production build + preview
npm run build     # tsc -b && vite build → dist/
npm run preview

# 7. lint
npm run lint      # eslint .
```

Same commands are documented in `AGENTS.md`.

## 3.3 Environment variables

All `VITE_`-prefixed (exposed via `import.meta.env`). Source: `.env.example` + `src/services/firebase.ts:5-13`.

| Variable | Purpose | Example |
|---|---|---|
| `VITE_FIREBASE_API_KEY` | Enables Firebase init (gate 1 of `hasConfig`) | `AIzaSy...` |
| `VITE_FIREBASE_AUTH_DOMAIN` | Stored in config; Auth SDK not actually imported | `gymbro-xxx.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Gate 2 of `hasConfig`; Firestore selector | `gymbro-prod` |
| `VITE_FIREBASE_STORAGE_BUCKET` | Stored only; Storage SDK not used | `gymbro-xxx.appspot.com` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Stored only; FCM not used | `1234567890` |
| `VITE_FIREBASE_APP_ID` | Firebase app identifier | `1:123:web:abc...` |
| `VITE_FIREBASE_MEASUREMENT_ID` | Analytics property id | `G-XXXXXXX` |

Behavior:

- `API_KEY` + `PROJECT_ID` set → `hasConfig=true` → `initializeApp`, `getFirestore`, `getAnalytics`.
- Either missing → `app/db/analytics = null`; service calls early-return or swallow; Dashboard shows zeros.

> These are public client keys by design. Restrict via Firebase console (API restrictions + Firestore rules), not secrecy.

## 3.4 Tests

**None.** No test runner, no `test` script, no `*.test.*` files. Verification:

```bash
npx tsc --noEmit
npm run lint
npm run build
```
