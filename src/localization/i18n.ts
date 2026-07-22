import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ar from './locales/ar.json';
import en from './locales/en.json';
import { getItem, setItem } from '@/services/storage';

const LANG_KEY = 'language';

function getInitialLanguage(): 'ar' | 'en' {
  const stored = getItem<string>(LANG_KEY);
  if (stored === 'ar' || stored === 'en') return stored;

  const navLang = navigator.language?.startsWith('ar') ? 'ar' : 'en';
  return navLang;
}

const lng = getInitialLanguage();

i18n.use(initReactI18next).init({
  resources: { ar: { translation: ar }, en: { translation: en } },
  lng,
  fallbackLng: 'ar',
  interpolation: { escapeValue: false },
  returnObjects: true,
});

i18n.on('languageChanged', (lang) => {
  setItem(LANG_KEY, lang);
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
});

document.documentElement.lang = lng;
document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';

export default i18n;
