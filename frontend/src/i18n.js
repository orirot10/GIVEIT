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
    fallbackLng: 'en', // Default language
    interpolation: {
    escapeValue: false, // React already escapes
    },
});

export default i18n;