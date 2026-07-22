import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { incrementWorkoutCompletion } from '@/services/userService';
import { trackWorkoutComplete } from '@/services/analytics';
import type { WorkoutDay, WorkoutProgress } from '@/types';
import { useEffect } from 'react';

interface LocationState {
  day: WorkoutDay;
  progress: WorkoutProgress;
}

export function WorkoutComplete() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;
  const day = state?.day;
  const progress = state?.progress;

  useEffect(() => {
    if (day) {
      incrementWorkoutCompletion().catch(() => {});
      trackWorkoutComplete(day.id);
    }
  }, [day]);

  if (!day || !progress) {
    return (
      <PageContainer title={t('common.error')} showBack>
        <p className="text-text-secondary">{t('common.error')}</p>
      </PageContainer>
    );
  }

  const duration = progress.endTime
    ? Math.round((progress.endTime - progress.startTime) / 60000)
    : 0;
  const percentage = Math.round(
    (progress.completedExercises.length / day.exerciseIds.length) * 100
  );

  return (
    <PageContainer className="flex flex-col items-center justify-center min-h-[80dvh]">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="w-24 h-24 rounded-full bg-success/10 flex items-center justify-center mb-6"
      >
        <span className="text-5xl">🎉</span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-3xl font-bold text-text-primary text-center mb-2"
      >
        {t('workout.completeTitle')}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-text-secondary text-center mb-8"
      >
        {t('workout.completeMessage')}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="w-full space-y-3 mb-8"
      >
        <h2 className="text-lg font-bold text-text-primary text-center mb-4">
          {t('workout.summary')}
        </h2>

        <div className="grid grid-cols-1 gap-3">
          <Card padding="lg" className="text-center">
            <p className="text-text-muted text-sm mb-1">
              {t('workout.exercisesCompleted')}
            </p>
            <p className="text-3xl font-bold text-text-primary">
              {progress.completedExercises.length}
              <span className="text-text-muted text-lg">/{day.exerciseIds.length}</span>
            </p>
          </Card>

          <Card padding="lg" className="text-center">
            <p className="text-text-muted text-sm mb-1">
              {t('workout.workoutDuration')}
            </p>
            <p className="text-3xl font-bold text-text-primary">
              {duration}
              <span className="text-text-muted text-lg"> {t('common.minutes')}</span>
            </p>
          </Card>

          <Card padding="lg" className="text-center">
            <p className="text-text-muted text-sm mb-1">
              {t('workout.completionPercentage')}
            </p>
            <p className="text-3xl font-bold text-success">
              {percentage}%
            </p>
          </Card>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="w-full"
      >
        <Button fullWidth size="lg" onClick={() => navigate('/home')}>
          {t('workout.backToHome')}
        </Button>
      </motion.div>
    </PageContainer>
  );
}
