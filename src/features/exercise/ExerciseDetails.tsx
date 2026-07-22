import { useParams, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { PageContainer } from '@/components/layout/PageContainer';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { getExerciseById } from '@/data';
import { trackExerciseView } from '@/services/analytics';
import { WeightLogger } from './WeightLogger';
import { useEffect } from 'react';
import { useWorkoutProgress } from '@/hooks/useWorkout';
import type { Difficulty } from '@/types';

const difficultyVariants: Record<Difficulty, 'success' | 'warning' | 'error'> = {
  beginner: 'success',
  intermediate: 'warning',
  advanced: 'error',
};

export function ExerciseDetails() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const dayId = (location.state as { dayId?: string })?.dayId;
  const { t } = useTranslation();
  const exercise = getExerciseById(id ?? '');
  const { toggleExercise } = useWorkoutProgress(dayId ?? '');

  useEffect(() => {
    if (exercise) {
      trackExerciseView(exercise.id);
    }
  }, [exercise]);

  const restSeconds = exercise ? parseInt(exercise.restTime.replace(/\D/g, ''), 10) : 120;

  if (!exercise) {
    return (
      <PageContainer title={t('errors.exerciseNotFound')} showBack>
        <p className="text-text-secondary">{t('common.error')}</p>
      </PageContainer>
    );
  }

  const sections: { key: string; titleKey: string; items: string[] }[] = [
    { key: 'setup', titleKey: 'exercise.setup', items: exercise.technique.setup },
    { key: 'execution', titleKey: 'exercise.execution', items: exercise.technique.execution },
    { key: 'breathing', titleKey: 'exercise.breathing', items: exercise.technique.breathing },
    { key: 'rangeOfMotion', titleKey: 'exercise.rangeOfMotion', items: exercise.technique.rangeOfMotion },
  ];

  return (
    <PageContainer title={t(exercise.nameKey)} showBack>
      {/* Exercise GIF */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full aspect-video rounded-2xl bg-surface-tertiary mb-6 overflow-hidden"
      >
        {exercise.gifPath ? (
          <img
            src={exercise.gifPath}
            alt={t(exercise.nameKey)}
            className="w-full h-full object-cover"
          />
        ) : exercise.videoUrl ? (
          <video
            src={exercise.videoUrl}
            poster={exercise.posterUrl}
            autoPlay loop muted playsInline
            className="w-full h-full object-cover"
          >
            {t('common.error')}
          </video>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <span className="text-5xl block mb-2">🏋️</span>
              <span className="text-text-muted text-sm">{t(exercise.nameKey)}</span>
            </div>
          </div>
        )}
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 gap-3 mb-6"
      >
        <Card padding="md" className="text-center">
          <p className="text-text-muted text-xs mb-1">{t('exercise.sets')}</p>
          <p className="text-text-primary text-xl font-bold">{exercise.sets}</p>
        </Card>
        <Card padding="md" className="text-center">
          <p className="text-text-muted text-xs mb-1">{t('exercise.reps')}</p>
          <p className="text-text-primary text-xl font-bold">{exercise.reps}</p>
        </Card>
        <Card padding="md" className="text-center">
          <p className="text-text-muted text-xs mb-1">{t('exercise.restTime')}</p>
          <p className="text-text-primary text-xl font-bold">{exercise.restTime}</p>
        </Card>
        <Card padding="md" className="text-center">
          <p className="text-text-muted text-xs mb-1">{t('exercise.difficulty')}</p>
          <Badge variant={difficultyVariants[exercise.difficulty]} className="mt-1">
            {t(`difficulty.${exercise.difficulty}`)}
          </Badge>
        </Card>
      </motion.div>

      {/* Muscle Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="mb-6"
      >
        <Card padding="md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-text-secondary text-sm">{t('exercise.primaryMuscle')}</span>
            <Badge variant="info">{t(exercise.primaryMuscleKey)}</Badge>
          </div>
          {exercise.secondaryMusclesKey.length > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-text-secondary text-sm">{t('exercise.secondaryMuscles')}</span>
              <div className="flex flex-wrap gap-1 justify-end">
                {exercise.secondaryMusclesKey.map((muscle) => (
                  <Badge key={muscle}>{t(muscle)}</Badge>
                ))}
              </div>
            </div>
          )}
          <div className="flex items-center justify-between mt-2">
            <span className="text-text-secondary text-sm">{t('exercise.equipment')}</span>
            <div className="flex flex-wrap gap-1 justify-end">
              {exercise.equipment.map((eq) => (
                <Badge key={eq}>{t(eq)}</Badge>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Weight Logger */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <WeightLogger
          exerciseId={exercise.id}
          sets={exercise.sets}
          restTime={restSeconds}
          onExerciseComplete={() => toggleExercise(exercise.id)}
        />
      </motion.div>

      {/* Technique Sections */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="space-y-6 mb-8"
      >
        <h2 className="text-lg font-bold text-text-primary">
          {t('exercise.technique')}
        </h2>

        {sections.map((section, idx) => (
          <motion.div
            key={section.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + idx * 0.05 }}
          >
            <h3 className="font-bold text-text-primary mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              {t(section.titleKey)}
            </h3>
            <ul className="space-y-2">
              {section.items.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-text-secondary">
                  <span className="w-5 h-5 rounded-full bg-surface-tertiary flex items-center justify-center text-xs text-text-muted flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span>{t(item)}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </motion.div>

      {/* Common Mistakes */}
      {exercise.commonMistakes.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-lg font-bold text-text-primary mb-3">
            {t('exercise.commonMistakes')}
          </h2>
          <div className="space-y-2">
            {exercise.commonMistakes.map((mistake, i) => (
              <Card key={i} padding="md" className="flex items-start gap-3 border-error/20">
                <span className="text-error flex-shrink-0 mt-0.5">✕</span>
                <span className="text-text-secondary">{t(mistake)}</span>
              </Card>
            ))}
          </div>
        </motion.div>
      )}

      {/* Coach Tips */}
      {exercise.coachTips.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="mb-8"
        >
          <h2 className="text-lg font-bold text-text-primary mb-3">
            {t('exercise.coachTips')}
          </h2>
          <div className="space-y-2">
            {exercise.coachTips.map((tip, i) => (
              <Card key={i} padding="md" className="flex items-start gap-3 border-accent/20 bg-accent/5">
                <span className="text-accent flex-shrink-0 mt-0.5">💡</span>
                <span className="text-text-secondary">{t(tip)}</span>
              </Card>
            ))}
          </div>
        </motion.div>
      )}
    </PageContainer>
  );
}
