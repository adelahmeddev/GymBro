# 5. API Documentation

There is **no custom REST/GraphQL backend**. The API surface is: (a) client routes, (b) Firestore collections, (c) Analytics events, (d) internal data-access functions (see `MODULES.md`).

## 5.1 App routes (React Router, `src/app/Router.tsx`)

| Path | Component | Purpose | Params / state |
|---|---|---|---|
| `/` | Landing | Entry + name capture | — |
| `/home` | Home | Split chooser | — |
| `/splits` | Splits | PPL day list | — |
| `/ppl/:dayId` | WorkoutDay | Day checklist | `dayId ∈ {push, pull, legs}` → builds `ppl/{dayId}` |
| `/exercise/:id` | ExerciseDetails | Guide + logging | `id` = exercise id; `location.state.dayId?` |
| `/workout-complete` | WorkoutComplete | Summary | `location.state = {day: WorkoutDay, progress: WorkoutProgress}` (required) |
| `/dashboard` | Dashboard | Stats | — |
| `*` | Navigate | Catch-all → `/` replace | — |

All are SPA navigations (`BrowserRouter`), no HTTP verbs. No route guards; any visitor can open any route.

Example:

```
/ppl/push → {id:'ppl/push', exerciseIds:['bench-press', ...]}
/exercise/squat  (state {dayId:'ppl/legs'})
/workout-complete (state {day, progress})
```

## 5.2 Firestore access (Firebase SDK, not HTTP)

| Collection / doc | Operation | Code | Schema |
|---|---|---|---|
| `users/{uuid}` | `setDoc`, `updateDoc`, `getDocs` + `query(where+orderBy)` | `userService.ts:32,43,83,90,98` | `{id, fullName, createdAt, lastActiveAt}` |
| `stats/visits` | `setDoc({count:increment(1)},{merge:true})` (write path dead) / `getDoc` | `:54-57,84` | `{count:number}` |
| `stats/workouts` | `setDoc({count:increment(1)},{merge:true})` / `getDoc` | `:59-63,85` | `{count:number}` |

No status codes — SDK promises; writes `.catch(()=>{})`, reads `try/catch → empty stats`.

## 5.3 Analytics events (`src/services/analytics.ts`)

| Event | Params | Fired from |
|---|---|---|
| `user_visit` | — | `createUser`, `updateLastActive` |
| `exercise_view` | `{exercise_id}` | `ExerciseDetails` mount |
| `workout_complete` | `{day_id}` | `WorkoutComplete` mount |
| `workout_start` | `{day_id}` | defined, never fired |
| `page_view` | `{page_name}` | defined, never fired |
