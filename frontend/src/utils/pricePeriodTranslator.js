import { useTranslation } from 'react-i18next';

// English to Hebrew price period mapping
const PRICE_PERIOD_TRANSLATIONS = {
  'use': {
    en: 'use',
    he: 'לשימוש'
  },
  'hour': {
    en: 'hour',
    he: 'לשעה'
  },
  'day': {
    en: 'day',
    he: 'ליום'
  },
  'week': {
    en: 'week',
    he: 'לשבוע'
  },
  'month': {
    en: 'month',
    he: 'לחודש'
  }
};

// Hook to translate price periods
export const usePricePeriodTranslation = () => {
  const { i18n } = useTranslation();
  
  const translatePricePeriod = (pricePeriod) => {
    if (!pricePeriod) return '';
    
    const translation = PRICE_PERIOD_TRANSLATIONS[pricePeriod];
    if (!translation) return pricePeriod;
    
    return translation[i18n.language] || translation.en;
  };
  
  const getPricePeriodOptions = () => {
    return Object.keys(PRICE_PERIOD_TRANSLATIONS).map(key => ({
      value: key,
      label: PRICE_PERIOD_TRANSLATIONS[key][i18n.language] || PRICE_PERIOD_TRANSLATIONS[key].en
    }));
  };
  
  return {
    translatePricePeriod,
    getPricePeriodOptions,
    currentLanguage: i18n.language
  };
};

// Standalone function for use outside of React components
export const translatePricePeriod = (pricePeriod, language = 'en') => {
  if (!pricePeriod) return '';
  
  const translation = PRICE_PERIOD_TRANSLATIONS[pricePeriod];
  if (!translation) return pricePeriod;
  
  return translation[language] || translation.en;
}; 