# GymBro - Build Commands

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# TypeScript check
npx tsc --noEmit

# Build for production
npm run build

# Preview production build
npm run preview
```

## Firebase Setup

Copy `.env.example` to `.env` and fill in your Firebase config values.

## Architecture

- Feature-based folder structure under `src/features/`
- Data-driven exercises via JSON in `src/data/`
- All UI text in `src/localization/locales/` (Arabic default, English fallback)
- Adding new splits/exercises requires only JSON changes, no UI code
