import { type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

interface PageContainerProps {
  children: ReactNode;
  title?: string;
  showBack?: boolean;
  className?: string;
}

export function PageContainer({ children, title, showBack = false, className = '' }: PageContainerProps) {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const isRTL = i18n.language === 'ar';

  return (
    <div className="min-h-dvh bg-surface safe-top">
      {(title || showBack) && (
        <header className="glass sticky top-0 z-40 border-b border-border safe-top">
          <div className="flex items-center justify-between px-4 h-14 max-w-3xl mx-auto">
            <div className="flex items-center gap-3">
              {showBack && (
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => navigate(-1)}
                  className="p-2 -ml-2 rounded-xl hover:bg-surface-tertiary transition-colors"
                  aria-label={t('common.back')}
                >
                  <svg
                    className={`w-5 h-5 text-text-primary ${isRTL ? 'rotate-180' : ''}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </motion.button>
              )}
              {title && (
                <h1 className="text-lg font-bold text-text-primary">{title}</h1>
              )}
            </div>

            <button
              onClick={() => {
                const newLang = isRTL ? 'en' : 'ar';
                i18n.changeLanguage(newLang);
              }}
              className="p-2 rounded-xl hover:bg-surface-tertiary transition-colors text-sm font-medium text-text-secondary"
            >
              {isRTL ? 'EN' : 'AR'}
            </button>
          </div>
        </header>
      )}

      <main className={`max-w-3xl mx-auto px-4 py-6 safe-bottom ${className}`}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
