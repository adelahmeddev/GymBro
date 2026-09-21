import pplData from './splits/ppl.json';
import arnoldData from './splits/arnold.json';
import futureSplits from './splits/future.json';
import pushExercises from './exercises/push.json';
import pullExercises from './exercises/pull.json';
import legsExercises from './exercises/legs.json';
import machinesExercises from './exercises/machines.json';
import { workoutDays } from './workoutDays';
import type { Split, Exercise, WorkoutDay } from '@/types';

const exerciseMap = new Map<string, Exercise>();
for (const ex of [...pushExercises, ...pullExercises, ...legsExercises, ...machinesExercises]) {
  exerciseMap.set(ex.id, ex as Exercise);
}

export function getEnabledSplits(): Split[] {
  return [pplData as Split, arnoldData as Split].filter((s) => s.enabled);
}

export function getAllSplits(): Split[] {
  return [pplData as Split, arnoldData as Split, ...futureSplits as Split[]];
}

export function getSplitById(id: string): Split | undefined {
  if (pplData.id === id) return pplData as Split;
  if (arnoldData.id === id) return arnoldData as Split;
  return futureSplits.find((s) => s.id === id) as Split | undefined;
}

export function getWorkoutDaysBySplit(splitId: string): WorkoutDay[] {
  return workoutDays.filter((day) => day.splitId === splitId);
}

export function getWorkoutDayById(id: string): WorkoutDay | undefined {
  return workoutDays.find((day) => day.id === id);
}

export function getExerciseById(id: string): Exercise | undefined {
  return exerciseMap.get(id);
}

export function getExercisesByIds(ids: string[]): Exercise[] {
  return ids.map((id) => exerciseMap.get(id)).filter(Boolean) as Exercise[];
}

export function getExercisesByWorkoutDay(dayId: string): Exercise[] {
  const day = getWorkoutDayById(dayId);
  if (!day) return [];
  return getExercisesByIds(day.exerciseIds);
}

export { pushExercises, pullExercises, legsExercises, machinesExercises, pplData, arnoldData, futureSplits, workoutDays };
