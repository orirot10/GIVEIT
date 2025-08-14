import React from 'react';
import { useTranslation } from 'react-i18next';

function Terms() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'he';
  return (
    <div className="p-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <h1 className="text-2xl mb-4">{t('terms.title')}</h1>
      <p>{t('terms.content')}</p>
    </div>
  );
}

export default Terms;
