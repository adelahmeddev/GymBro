import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { WorkoutProgress } from '@/types';

const PROGRESS_KEY_PREFIX = 'workout_progress_';

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
