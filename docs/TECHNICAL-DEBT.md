# 8. Known Issues, TODOs & Technical Debt

Grep for `TODO|FIXME|HACK|XXX|BUG|ts-ignore|ts-expect-error|console.log|as any` in `src/` returns **zero hits**. No TODO comments. Items below are observed from code, ordered by user impact.

1. **Visit counter never increments.** `incrementVisitCount()` (`userService.ts:53-57`) has zero call sites. `trackVisit()` only fires Analytics. `Dashboard.totalVisits` reads `stats/visits` which nothing writes → stays 0.
2. **`mostViewedExercises` always empty; `mostActiveUsers.count` hardcoded.** `getDashboardStats()` returns `mostViewedExercises: []` (`:115`), maps `count: 1` (`:104-107`). `trackExerciseView` events are never aggregated.
3. **Workout progress never resets.** `useWorkoutProgress` initial state created once per `workout_progress_{dayId}` key. `completeWorkout()` (sets `endTime/completed`) is **never called** — CTA just navigates. Redoing a workout reuses old `startTime`; `WorkoutComplete.duration` is wrong (or 0).
4. **Stale-closure weight log.** `WeightLogger.handleLog` calls `logSet()` then immediately `getLogForExercise()` from the old closure (`WeightLogger.tsx:32-42`); banner may lag one render.
5. **`WeightSetRow` inputs seed once.** `useState(log?.weight...)` (`:121-122`) — external log updates don't refresh inputs.
6. **Empty-dayId progress key.** `ExerciseDetails` calls `useWorkoutProgress(dayId ?? '')`; direct navigation creates junk key `workout_progress_` and toggles the wrong day.
7. **Storage key inconsistency.** `services/storage.ts` prefixes (`gymbro_*`); `useLocalStorage` does not (`workout_progress_*`, `weight_logs`).
8. **UTC vs local day.** Weight logs bucket by `toISOString()` (UTC); UTC+2/3 evening sessions can split across dates.
9. **Hardcoded split + fragile day-id coupling.** `Splits.tsx` hardcodes `'ppl'`; `Router` is `/ppl/:dayId`; `WorkoutDay` rebuilds `` `ppl/${dayId}` ``. A second enabled split needs 3-file change (contradicts "JSON-only" claim for splits).
10. **Content/data mismatches.** Reused `gifPath`s (lat-pulldown → barbell-row.gif, rear-delt-fly → lateral-raise, curls → dumbbell-curl, leg-curl → romanian-deadlift, abs → calf-raises); `leg-curl` reuses RDL video/poster; `equipment.legPress` key missing in locales (file defines `legPressMachine`) → raw `equipment.…` renders.
11. **`RestTimer` fragility.** `rafRef` declared after `tick` references it; resets on every `running`/`duration` change; no pause; `AudioContext` per beep never closed; `Rest` label hardcoded English.
12. **`useAuth` effect churn.** `updateLastActive` fires on every `user` identity change, including local-only bumps → redundant writes + events.
13. **Unused surface.** `clearLocalUser`, `trackPageView`, `trackWorkoutStart`, `getEnabledSplits`, `getSplitById`, `completeWorkout`, `refreshLastActive` (partially); empty `src/utils/`, `src/assets/{gifs,images}/`; `public/icons/*.png` duplicates root SVGs; `scripts/` hardcodes a Windows temp path.
14. **No error boundaries / offline UI / tests.** JSON typo or missing locale key renders raw key text; Firestore failures are silent by design but indistinguishable from zero data.

History (`git log --oneline`, 11 commits): PWA/asset fixes (GIF precache, icons, `_headers`, R2 video switch, PPL replacement). Working tree clean at time of audit.
