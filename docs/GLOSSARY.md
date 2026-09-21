# 9. Glossary

| Term | Meaning |
|---|---|
| **PPL** | Push-Pull-Legs split (`splits/ppl.json`, id `ppl`). Only enabled split. |
| **Split** | Training program: `{id, nameKey, descriptionKey, enabled, days[], icon?}`. Future splits exist with `enabled:false`, `days:[]`. |
| **WorkoutDay / Day** | One training day, id `{splitId}/{dayId}` (e.g. `ppl/push`): duration, target muscles, ordered `exerciseIds[]`. |
| **Exercise** | One movement: media, muscles, difficulty, equipment, `sets` (number) × `reps` (range string), `restTime` (`"120s"` string), technique/mistakes/tips as i18n key arrays. |
| **nameKey / *Key** | i18n lookup keys (e.g. `exercises.squat.name`), resolved by `t(key)` against `ar.json`/`en.json`. |
| **TechniqueSection** | `{setup, execution, breathing, rangeOfMotion}` — four instructional blocks per exercise. |
| **Set × Reps** | `sets: 3`, `reps: "8-12"` prescribed; `WeightSet {setNumber, weight, reps}` is the logged actual. |
| **WeightLog** | Per-exercise-per-day `{exerciseId, date, sets[]}` in `weight_logs`. |
| **WorkoutProgress** | Per-day checklist `{dayId, date, completedExercises[], startTime, endTime?, completed}` in `workout_progress_{dayId}`. |
| **hasConfig** | `Boolean(apiKey && projectId)` — master switch for Firebase behavior. |
| **RTL** | Right-to-left when `i18n.language==='ar'` (`document.dir`, `index.html dir=rtl`, arrow flips). |
| **FallbackLng `ar`** | Missing EN strings resolve to Arabic, not English. |
| **PWA / Workbox** | Installable shell; `NetworkFirst` Firestore cache (50 entries, 24h). |
| **R2** | Cloudflare R2 public bucket for MP4/poster URLs (`pub-585d42eb…r2.dev`). |
| **`gymbro_` prefix** | Namespace for `services/storage.ts` keys (`current_user`, `language`). Not applied by `useLocalStorage`. |
| **DashboardStats** | Aggregated counters + user lists for `/dashboard`; several fields are placeholders (see `TECHNICAL-DEBT.md`). |
