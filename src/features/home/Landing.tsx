import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { getLocalUser } from '@/services/userService';

export function Landing() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const [name, setName] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [error, setError] = useState('');
  const [existingUser] = useState(getLocalUser());

  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    if (existingUser) {
      navigate('/home', { replace: true });
    }
  }, [existingUser, navigate]);

  const handleStart = () => {
    setShowInput(true);
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError(t('auth.error'));
      return;
    }
    setError('');
    try {
      await login(name.trim());
      navigate('/home', { replace: true });
    } catch {
      setError(t('common.error'));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
  };

  if (existingUser) return null;

  return (
    <div className="min-h-dvh bg-surface flex flex-col items-center justify-center px-6 safe-top safe-bottom">
      <AnimatePresence mode="wait">
        {!showInput ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center text-center w-full max-w-sm"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
              className="w-24 h-24 rounded-2xl bg-accent/10 flex items-center justify-center mb-8"
            >
              <span className="text-5xl">💪</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-bold text-text-primary mb-3"
            >
              {t('landing.title')}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-text-secondary text-lg mb-10"
            >
              {t('landing.subtitle')}
            </motion.p>

            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleStart}
              className="w-full max-w-xs py-4 px-8 bg-accent text-white text-lg font-bold rounded-2xl shadow-lg shadow-accent/25 hover:bg-accent-hover transition-colors"
            >
              {t('landing.startButton')}
            </motion.button>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              onClick={() => {
                const newLang = isRTL ? 'en' : 'ar';
                i18n.changeLanguage(newLang);
              }}
              className="mt-6 text-sm text-text-muted hover:text-text-secondary transition-colors"
            >
              {isRTL ? 'Switch to English' : 'التبديل إلى العربية'}
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="auth"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center text-center w-full max-w-sm"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="w-20 h-20 rounded-2xl bg-accent/10 flex items-center justify-center mb-6"
            >
              <span className="text-4xl">💪</span>
            </motion.div>

            <h2 className="text-2xl font-bold text-text-primary mb-2">
              {t('auth.title')}
            </h2>
            <p className="text-text-secondary mb-8">
              {t('auth.subtitle')}
            </p>

            <div className="w-full space-y-4">
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setError(''); }}
                onKeyDown={handleKeyDown}
                placeholder={t('auth.placeholder')}
                className="w-full px-5 py-4 bg-surface-tertiary border border-border text-text-primary placeholder-text-muted rounded-2xl focus:outline-none focus:border-accent transition-colors text-lg"
                autoFocus
                dir="auto"
              />

              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-error text-sm"
                >
                  {error}
                </motion.p>
              )}

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-4 px-8 bg-accent text-white text-lg font-bold rounded-2xl shadow-lg shadow-accent/25 hover:bg-accent-hover transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <svg className="animate-spin h-6 w-6 mx-auto" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  t('auth.button')
                )}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
