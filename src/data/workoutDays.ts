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
      'bench-press',
      'incline-dumbbell-press',
      'shoulder-press',
      'lateral-raise',
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
      'lat-pulldown',
      'barbell-row',
      'rear-delt-fly',
      'barbell-curl',
      'hammer-curl',
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
      'squat',
      'romanian-deadlift',
      'leg-press',
      'leg-curl',
      'calf-raise',
      'abs',
    ],
    dayOrder: 3,
  },
];

export const workoutDayMap = Object.fromEntries(
  workoutDays.map((day) => [day.id, day])
);
