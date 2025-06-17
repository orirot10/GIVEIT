import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enTranslations from './en.json';
import heTranslations from './he.json';

// Initialize i18next
i18n
.use(LanguageDetector) // Language detector
.use(initReactI18next)  // Bind react-i18next to i18next
.init({
    resources: {
    en: { translation: enTranslations },
    he: { translation: heTranslations },
    },
    fallbackLng: 'he', // Changed default to Hebrew
    lng: 'he', // Force initial language to Hebrew
    interpolation: {
    escapeValue: false, // React already escapes
    },
    detection: {
    order: ['localStorage', 'navigator'],
    caches: ['localStorage'],
    },
    react: {
    useSuspense: false,
    },
});

// Add RTL support
i18n.on('languageChanged', (lng) => {
    document.documentElement.dir = lng === 'he' ? 'rtl' : 'ltr';
    document.documentElement.lang = lng;
});

export default i18n;