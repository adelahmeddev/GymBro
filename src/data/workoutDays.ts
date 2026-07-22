import type { WorkoutDay } from '@/types';

export const workoutDays: WorkoutDay[] = [
  {
    id: 'ppl/push',
    splitId: 'ppl',
    nameKey: 'workoutDays.push.name',
    descriptionKey: 'workoutDays.push.description',
    estimatedDuration: 60,
    targetMuscles: ['muscles.chest', 'muscles.shoulders', 'muscles.triceps'],
    exerciseIds: [
      'barbell-bench-press',
      'overhead-press',
      'incline-dumbbell-press',
      'dumbbell-lateral-raise',
      'triceps-pushdown',
    ],
    dayOrder: 1,
  },
  {
    id: 'ppl/pull',
    splitId: 'ppl',
    nameKey: 'workoutDays.pull.name',
    descriptionKey: 'workoutDays.pull.description',
    estimatedDuration: 55,
    targetMuscles: ['muscles.back', 'muscles.biceps'],
    exerciseIds: [
      'deadlift',
      'barbell-row',
      'pull-up',
      'dumbbell-curl',
    ],
    dayOrder: 2,
  },
  {
    id: 'ppl/legs',
    splitId: 'ppl',
    nameKey: 'workoutDays.legs.name',
    descriptionKey: 'workoutDays.legs.description',
    estimatedDuration: 60,
    targetMuscles: ['muscles.quads', 'muscles.hamstrings', 'muscles.glutes', 'muscles.calves'],
    exerciseIds: [
      'barbell-squat',
      'romanian-deadlift',
      'leg-press',
      'dumbbell-lunges',
      'calf-raises',
    ],
    dayOrder: 3,
  },
];

export const workoutDayMap = Object.fromEntries(
  workoutDays.map((day) => [day.id, day])
);
