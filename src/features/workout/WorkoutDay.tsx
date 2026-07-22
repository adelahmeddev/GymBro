import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Checkbox } from '@/components/ui/Checkbox';
import { getWorkoutDayById, getExercisesByWorkoutDay } from '@/data';
import { useWorkoutProgress } from '@/hooks/useWorkout';
import type { Exercise } from '@/types';

export function WorkoutDay() {
  const { dayId } = useParams<{ dayId: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const day = getWorkoutDayById(`ppl/${dayId ?? ''}`);
  const exercises = day ? getExercisesByWorkoutDay(day.id) : [];
  const { progress, toggleExercise, isExerciseCompleted } = useWorkoutProgress(day?.id ?? '');

  if (!day) {
    return (
      <PageContainer title={t('errors.workoutNotFound')} showBack>
        <p className="text-text-secondary">{t('common.error')}</p>
      </PageContainer>
    );
  }

  const completedCount = progress.completedExercises.length;
  const totalCount = exercises.length;
  const allComplete = completedCount === totalCount && totalCount > 0;

  return (
    <PageContainer title={t(day.nameKey)} showBack>
      {/* Day Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-text-primary">
              {t(day.nameKey)}
            </h2>
            <p className="text-text-secondary mt-1">
              {t(day.descriptionKey)}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <Badge>
            {day.estimatedDuration} {t('workoutDays.details.minutes')}
          </Badge>
          <Badge>
            {day.exerciseIds.length} {t('workoutDays.details.exercisesCount')}
          </Badge>
        </div>

        <div>
          <p className="text-text-secondary text-sm mb-2">
            {t('workoutDays.details.targetMuscles')}
          </p>
          <div className="flex flex-wrap gap-2">
            {day.targetMuscles.map((muscle) => (
              <Badge key={muscle} variant="info">
                {t(muscle)}
              </Badge>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Progress */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-text-secondary text-sm">
            {t('workout.progress')}
          </span>
          <span className="text-text-primary text-sm font-medium">
            {completedCount}/{totalCount}
          </span>
        </div>
        <ProgressBar value={completedCount} max={totalCount} />
      </motion.div>

      {/* Exercise List */}
      <div className="space-y-3 mb-8">
        {exercises.map((exercise: Exercise, index: number) => {
          const completed = isExerciseCompleted(exercise.id);
          return (
            <motion.div
              key={exercise.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <Card
                hoverable
                onClick={() => navigate(`/exercise/${exercise.id}`, { state: { dayId: day.id } })}
                padding="md"
                className={completed ? 'border-accent/30' : ''}
              >
                <div className="flex items-center gap-4">
                  <div className="w-1 self-stretch rounded-full bg-surface-tertiary flex-shrink-0 overflow-hidden">
                    <motion.div
                      animate={completed ? { height: '100%' } : { height: '0%' }}
                      className="w-full bg-accent rounded-full"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-text-primary">
                        {t(exercise.nameKey)}
                      </h3>
                      <div onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={completed}
                          onChange={() => toggleExercise(exercise.id)}
                          id={`check-${exercise.id}`}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-text-muted text-xs">
                        {t(exercise.primaryMuscleKey)}
                      </span>
                      <span className="text-text-muted">·</span>
                      <span className="text-text-muted text-xs">
                        {exercise.sets}×{exercise.reps}
                      </span>
                      <span className="text-text-muted">·</span>
                      <span className="text-text-muted text-xs">
                        {exercise.restTime}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Complete Button */}
      {allComplete && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-0 left-0 right-0 p-4 glass border-t border-border safe-bottom"
        >
          <div className="max-w-3xl mx-auto">
            <Button
              fullWidth
              size="lg"
              onClick={() => navigate('/workout-complete', { state: { day, progress } })}
            >
              {t('workout.completeTitle')} 🎉
            </Button>
          </div>
        </motion.div>
      )}
    </PageContainer>
  );
}
