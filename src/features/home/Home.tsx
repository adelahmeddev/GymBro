import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/hooks/useAuth';
import { getAllSplits } from '@/data';
import type { Split } from '@/types';

export function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const allSplits = getAllSplits();

  return (
    <PageContainer>
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-6"
        >
          <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center">
            <span className="text-2xl">💪</span>
          </div>
          <div>
            <p className="text-text-secondary text-sm">{t('home.welcome')}</p>
            <h1 className="text-2xl font-bold text-text-primary">
              {user?.fullName ?? t('app.name')}
            </h1>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-text-secondary"
        >
          {t('home.subtitle')}
        </motion.p>
      </div>

      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <h2 className="text-lg font-bold text-text-primary mb-4">
          {t('home.availableSplits')}
        </h2>

        <div className="space-y-3">
          {allSplits.map((split: Split) => {
            const isEnabled = split.enabled;
            return (
              <Card
                key={split.id}
                hoverable
                onClick={isEnabled ? () => navigate('/splits') : undefined}
                className={!isEnabled ? 'opacity-50' : ''}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-surface-tertiary flex items-center justify-center text-xl flex-shrink-0">
                    {split.icon ?? '🏋️'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-text-primary">
                        {t(split.nameKey)}
                      </h3>
                      {!isEnabled && (
                        <Badge variant="warning">{t('home.comingSoon')}</Badge>
                      )}
                    </div>
                    <p className="text-text-secondary text-sm mt-0.5">
                      {t(split.descriptionKey)}
                    </p>
                  </div>
                  {isEnabled && (
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
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </motion.section>
    </PageContainer>
  );
}
