import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/Card';
import { getDashboardStats } from '@/services/userService';
import type { DashboardStats } from '@/types';

export function Dashboard() {
  const { t } = useTranslation();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageContainer title={t('dashboard.title')} showBack>
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <svg className="animate-spin h-8 w-8 text-accent" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <StatCard
              label={t('dashboard.totalUsers')}
              value={stats?.totalUsers ?? 0}
              suffix={t('dashboard.users')}
              delay={0.1}
            />
            <StatCard
              label={t('dashboard.activeToday')}
              value={stats?.activeUsersToday ?? 0}
              suffix={t('dashboard.users')}
              delay={0.15}
            />
            <StatCard
              label={t('dashboard.totalVisits')}
              value={stats?.totalVisits ?? 0}
              suffix={t('dashboard.visits')}
              delay={0.2}
            />
            <StatCard
              label={t('dashboard.workoutCompletions')}
              value={stats?.workoutCompletionCount ?? 0}
              suffix={t('dashboard.completions')}
              delay={0.25}
            />
          </div>

          {stats && stats.mostActiveUsers.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card padding="lg">
                <h3 className="font-bold text-text-primary mb-3">
                  {t('dashboard.mostActiveUsers')}
                </h3>
                <div className="space-y-2">
                  {stats.mostActiveUsers.map((user, i) => (
                    <div key={i} className="flex items-center justify-between py-1">
                      <div className="flex items-center gap-2">
                        <span className="text-text-muted text-sm w-5">{i + 1}.</span>
                        <span className="text-text-secondary text-sm">{user.name}</span>
                      </div>
                      <span className="text-text-primary text-sm font-medium">-</span>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      )}
    </PageContainer>
  );
}

function StatCard({
  label,
  value,
  suffix,
  delay,
}: {
  label: string;
  value: number;
  suffix: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Card padding="lg" className="text-center">
        <p className="text-text-muted text-xs mb-1">{label}</p>
        <p className="text-2xl font-bold text-text-primary">
          {value.toLocaleString()}
        </p>
        <p className="text-text-muted text-xs mt-1">{suffix}</p>
      </Card>
    </motion.div>
  );
}
