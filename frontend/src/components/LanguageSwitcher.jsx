import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div 
      className="fixed top-4 right-4 z-[9999]"
      style={{
        position: 'fixed',
        top: '1rem',
        right: '1rem',
        zIndex: 9999,
      }}
    >
      <button
        onClick={() => handleLanguageChange(i18n.language === 'he' ? 'en' : 'he')}
        className="px-4 py-2 text-base font-bold rounded-full bg-blue-500 text-white shadow-lg hover:bg-blue-600 transition-all duration-200"
        style={{
          minWidth: '50px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        {i18n.language === 'he' ? 'EN' : 'עב'}
      </button>
    </div>
  );
};

export default LanguageSwitcher;