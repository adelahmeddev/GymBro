# 4. Core Modules / Components

## 4.1 `src/types/index.ts` — domain model

```ts
User { id: string; fullName: string; createdAt: number; lastActiveAt: number }
Split { id; nameKey; descriptionKey; enabled: boolean; days: string[]; icon?: string }
WorkoutDay { id; splitId; nameKey; descriptionKey; estimatedDuration: number;
  targetMuscles: string[]; exerciseIds: string[]; dayOrder: number }
Exercise { id; nameKey; gifPath?; videoUrl?; posterUrl?; primaryMuscleKey: string;
  secondaryMusclesKey: string[]; difficulty: Difficulty; equipment: string[];
  sets: number; reps: string; restTime: string; technique: TechniqueSection;
  commonMistakes: string[]; coachTips: string[] }
TechniqueSection { setup: string[]; execution: string[]; breathing: string[]; rangeOfMotion: string[] }
WeightLog { exerciseId: string; date: string; sets: WeightSet[] }
WeightSet { setNumber: number; weight: number; reps: number }
WorkoutProgress { dayId; date; completedExercises: string[]; startTime: number; endTime?: number; completed: boolean }
DashboardStats { totalUsers; activeUsersToday; totalVisits;
  mostActiveUsers: {name;count}[]; workoutCompletionCount; mostViewedExercises: {name;views}[] }
Difficulty = 'beginner'|'intermediate'|'advanced'; Language = 'ar'|'en'
```

Rule: everything user-visible is a **key** (e.g. `exercises.benchPress.name`), never a literal. Keys must exist in both locale files.

## 4.2 `src/data/index.ts` — content access layer

In-memory `Map<string, Exercise>` built once from push/pull/legs JSON.

| Function | Signature | Notes |
|---|---|---|
| `getEnabledSplits` | `() => Split[]` | `[ppl]` iff `ppl.enabled`. Currently unused by UI. |
| `getAllSplits` | `() => Split[]` | `[ppl, ...future]` → enabled + coming-soon cards. |
| `getSplitById` | `(id: string) => Split \| undefined` | ppl + future lookup. |
| `getWorkoutDaysBySplit` | `(splitId: string) => WorkoutDay[]` | `filter(d => d.splitId === splitId)`. |
| `getWorkoutDayById` | `(id: string) => WorkoutDay \| undefined` | Exact match, e.g. `ppl/push`. |
| `getExerciseById` | `(id: string) => Exercise \| undefined` | `exerciseMap.get(id)`. |
| `getExercisesByIds` | `(ids: string[]) => Exercise[]` | Drops missing (`filter(Boolean)`). |
| `getExercisesByWorkoutDay` | `(dayId: string) => Exercise[]` | `[]` if day missing. |

```ts
import { getExercisesByWorkoutDay } from '@/data';
const push = getExercisesByWorkoutDay('ppl/push'); // 5 exercises
```

Add content: append to `push|pull|legs.json` → add id to `workoutDays.ts → exerciseIds` → add `*Key` strings to `ar.json` + `en.json`. No component change needed.

## 4.3 Data files

- `workoutDays.ts`: Push (60 min, chest/shoulders/triceps, 5 ex), Pull (55 min, back/biceps, 5 ex), Legs (60 min, quads/hamstrings/glutes/calves, 6 ex incl. `abs`).
- `splits/ppl.json`: `{id:'ppl', enabled:true, days:['ppl/push','ppl/pull','ppl/legs'], icon:'💪'}`.
- `splits/future.json`: 4 disabled placeholders (`arnold`, `upper-lower`, `bro-split`, `full-body`, `days:[]`).
- Exercise JSON: `sets` number, `reps` range string (`"8-12"`), `restTime` `"120s"` parsed at runtime via `parseInt(restTime.replace(/\D/g,''))` (`ExerciseDetails.tsx:34`).
- Media priority (`ExerciseDetails.tsx:59-81`): `videoUrl` (R2 MP4 autoplay/muted/loop) → `gifPath` (local `/exercises/*.gif`) → emoji placeholder.
- 16 exercises: bench-press, incline-dumbbell-press, shoulder-press, lateral-raise, triceps-pushdown, lat-pulldown, barbell-row, rear-delt-fly, barbell-curl, hammer-curl, squat, romanian-deadlift, leg-press, leg-curl, calf-raise, abs.

## 4.4 Services

**`services/storage.ts`** — sync JSON localStorage with `gymbro_` prefix:

```ts
getItem<T>(key: string): T | null
setItem<T>(key: string, value: T): void
removeItem(key: string): void
```

**`services/firebase.ts`** — conditional init. Exports `{app, db, analytics, hasConfig}`.

**`services/userService.ts`**

| Function | Signature | Notes |
|---|---|---|
| `getLocalUser` | `() => User \| null` | reads `gymbro_current_user` |
| `saveLocalUser` | `(user: User) => void` | overwrite local |
| `clearLocalUser` | `() => void` | defined, never called (no logout UI) |
| `createUser` | `(fullName: string) => Promise<User>` | UUID + timestamps; best-effort `setDoc(users/{id})`; saves locally + `trackVisit()` |
| `updateLastActive` | `(userId: string) => Promise<void>` | best-effort `updateDoc`; syncs local; `trackVisit()` |
| `incrementVisitCount` | `() => Promise<void>` | `stats/visits` increment; **never called** |
| `incrementWorkoutCompletion` | `() => Promise<void>` | `stats/workouts` increment; called on `WorkoutComplete` mount |
| `getDashboardStats` | `() => Promise<DashboardStats>` | 3 parallel reads + 2 ordered queries; zeros when offline/error |

**`services/analytics.ts`** — `logEvent` wrappers, no-op when `analytics == null`:

```ts
trackEvent(name, params?) / trackPageView(pageName) / trackExerciseView(id)
trackWorkoutStart(dayId) / trackWorkoutComplete(dayId) / trackVisit()
```

Actually invoked: `trackExerciseView`, `trackWorkoutComplete`, `trackVisit`.

## 4.5 Hooks

**`useLocalStorage<T>(key, initialValue)`** (`hooks/useLocalStorage.ts`): lazy init from `localStorage.getItem(key)` (**raw key, no `gymbro_` prefix**). Functional updates supported. Silent on quota errors.

**`useAuth()`** (`hooks/useAuth.ts`): `{user, loading, login, updateUser, refreshLastActive}`. `login(fullName)` → `createUser` → `setUser`. Effect: `updateLastActive(user.id)` on `user` change.

**`useWorkoutProgress(dayId)`** (`hooks/useWorkout.ts`): key `workout_progress_${dayId}`, initial `{dayId, date: today, completedExercises: [], startTime: Date.now(), completed: false}`. Returns `{progress, toggleExercise, completeWorkout, isExerciseCompleted}`.

**`useWeightLogs()`**: key `weight_logs`, buckets by UTC day. Returns `{logs, getLogForExercise, logSet}`. `logSet(exerciseId, setNumber, weight, reps)` upserts today's set.

```tsx
const { progress, toggleExercise } = useWorkoutProgress('ppl/push');
toggleExercise('bench-press');
```

## 4.6 Features (routes)

| Route | Component | Key logic |
|---|---|---|
| `/` | `Landing` | Redirect if local user; 2-step motion UI; `login(name)` → `/home`; AR/EN toggle |
| `/home` | `Home` | `user?.fullName ?? t('app.name')`; `getAllSplits()`; enabled → `/splits`, disabled → badge |
| `/splits` | `Splits` | Hardcodes `getWorkoutDaysBySplit('ppl')`; `navigate('/'+day.id)` |
| `/ppl/:dayId` | `WorkoutDay` | Rebuilds `ppl/${dayId}`; `ProgressBar`; Card → `/exercise/:id` w/ `state:{dayId}`; checkbox `stopPropagation`; bottom CTA only when all complete; passes `{day, progress}` state onward |
| `/exercise/:id` | `ExerciseDetails` | `trackExerciseView`; media hero; stats/muscle cards; `WeightLogger`; technique/mistakes/tips |
| `/workout-complete` | `WorkoutComplete` | Requires `location.state`; `duration = round((endTime-startTime)/60000)`; `% = completed/total*100`; mount effect increments + tracks; CTA → `/home` |
| `/dashboard` | `Dashboard` | `getDashboardStats()` once; spinner → 4 stat cards + most-active list |

## 4.7 Shared UI + localization

- `PageContainer({children, title?, showBack?, className?})` — sticky glass header, `navigate(-1)` back w/ RTL flip, `EN/AR` toggle, `max-w-3xl` fade-in main.
- `Button({variant: primary|secondary|ghost|outline, size: sm|md|lg, fullWidth, loading, icon})` — `motion.button`, tap 0.97 / hover 1.02, spinner when loading, `forwardRef`.
- `Card({padding: none|sm|md|lg, hoverable, onClick})` — `motion.button` when clickable else `motion.div`; `card-hover` lift.
- `Badge({variant: default|success|warning|error|info})` — pill.
- `Checkbox({checked, onChange, label?, id?})` — hidden native input + animated box.
- `ProgressBar({value, max=100, showLabel?})` — capped %, 0.5s tween.
- `WeightLogger({exerciseId, sets, restTime, onExerciseComplete})` — collapsible set rows (validate `w>0 && r>0`), success banner, `RestTimer` after non-final sets.
- `RestTimer({duration, running, onComplete})` — `requestAnimationFrame` countdown, SVG ring, 880 Hz beep once, `m:ss` + hardcoded `Rest` label.
- `i18n.ts` — `{ar, en}`, stored-lang else `navigator.language`, `fallbackLng: 'ar'`, `returnObjects: true`, persists + sets `document.lang/dir` on change.
