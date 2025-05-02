import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
const { i18n } = useTranslation();

const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang); // This switches the language
};

return (
    <div className="language-switcher">
    <button onClick={() => handleLanguageChange('en')}>English</button>
    <button onClick={() => handleLanguageChange('he')}>עברית</button>
    </div>
);
};

export default LanguageSwitcher;