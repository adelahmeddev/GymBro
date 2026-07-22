import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { getWorkoutDaysBySplit } from '@/data';
import type { WorkoutDay } from '@/types';

export function Splits() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const days = getWorkoutDaysBySplit('ppl');

  return (
    <PageContainer title={t('splits.ppl.name')} showBack>
      <p className="text-text-secondary mb-6">
        {t('splits.selectSplit')}
      </p>

      <div className="grid gap-4">
        {days.map((day: WorkoutDay, index: number) => (
          <motion.div
            key={day.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              hoverable
              onClick={() => navigate(`/${day.id}`)}
              padding="lg"
            >
              <div className="flex items-center gap-4">
                <div className={`
                  w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0
                  ${index === 0 ? 'bg-accent/10' : index === 1 ? 'bg-info/10' : 'bg-success/10'}
                `}>
                  {index === 0 ? '🔥' : index === 1 ? '💪' : '🦵'}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-text-primary">
                    {t(day.nameKey)}
                  </h3>
                  <p className="text-text-secondary text-sm mt-1">
                    {t(day.descriptionKey)}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <Badge>
                      {day.estimatedDuration} {t('workoutDays.details.minutes')}
                    </Badge>
                    <Badge>
                      {day.exerciseIds.length} {t('workoutDays.details.exercisesCount')}
                    </Badge>
                  </div>
                </div>
                <svg
                  className="w-5 h-5 text-text-muted flex-shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </PageContainer>
  );
}
