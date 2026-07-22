import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { WorkoutProgress, WeightLog, WeightSet } from '@/types';

const PROGRESS_KEY_PREFIX = 'workout_progress_';
const WEIGHT_LOG_KEY = 'weight_logs';

export function useWorkoutProgress(dayId: string) {
  const [progress, setProgress] = useLocalStorage<WorkoutProgress>(
    PROGRESS_KEY_PREFIX + dayId,
    { dayId, date: new Date().toISOString().split('T')[0] ?? '', completedExercises: [], startTime: Date.now(), completed: false }
  );

  const toggleExercise = useCallback(
    (exerciseId: string) => {
      setProgress((prev) => {
        const exists = prev.completedExercises.includes(exerciseId);
        return {
          ...prev,
          completedExercises: exists
            ? prev.completedExercises.filter((id) => id !== exerciseId)
            : [...prev.completedExercises, exerciseId],
        };
      });
    },
    [setProgress]
  );

  const completeWorkout = useCallback(() => {
    setProgress((prev) => ({
      ...prev,
      completed: true,
      endTime: Date.now(),
    }));
  }, [setProgress]);

  const isExerciseCompleted = useCallback(
    (exerciseId: string) => progress.completedExercises.includes(exerciseId),
    [progress.completedExercises]
  );

  return {
    progress,
    toggleExercise,
    completeWorkout,
    isExerciseCompleted,
  };
}

export function useWeightLogs() {
  const [logs, setLogs] = useLocalStorage<WeightLog[]>(WEIGHT_LOG_KEY, []);

  const getLogForExercise = useCallback(
    (exerciseId: string) => {
      const today = new Date().toISOString().split('T')[0];
      return logs.find((l) => l.exerciseId === exerciseId && l.date === today) ?? null;
    },
    [logs]
  );

  const logSet = useCallback(
    (exerciseId: string, setNumber: number, weight: number, reps: number) => {
      const today = new Date().toISOString().split('T')[0] ?? '';
      setLogs((prev) => {
        const existing = prev.findIndex(
          (l) => l.exerciseId === exerciseId && l.date === today
        );
        const newSet: WeightSet = { setNumber, weight, reps };

        if (existing >= 0) {
          const updated = [...prev];
          const log = { ...updated[existing]! };
          const setIdx = log.sets.findIndex((s) => s.setNumber === setNumber);
          if (setIdx >= 0) {
            log.sets[setIdx] = newSet;
          } else {
            log.sets.push(newSet);
          }
          updated[existing] = log;
          return updated;
        }

        return [
          ...prev,
          { exerciseId, date: today, sets: [newSet] },
        ];
      });
    },
    [setLogs]
  );

  return { logs, getLogForExercise, logSet };
}
