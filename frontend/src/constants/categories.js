// Bilingual category and tag definitions for rentals and services.
// Each tag stores English and Hebrew labels along with a short label used in filters.

// ---------------------- Service Categories ----------------------
export const serviceCategoryData = [
  {
    value: 'tutoring',
    en: 'Tutoring',
    he: 'שיעורים',
    short: { en: 'Tut', he: 'שיעור פרטי' }
  },
  {
    value: 'summaries',
    en: 'Summaries',
    he: 'ש.ב ',
    short: { en: 'Summ', he: 'ש.ב' }
  },
  {
    value: 'transport',
    en: 'Transport',
    he: 'הובלה',
    short: { en: 'Trans', he: 'הובלה' }
  },
  {
    value: 'care',
    en: 'Care',
    he: 'טיפול',
    short: { en: 'Care', he: 'טיפול' }
  },
  {
    value: 'tech_repairs',
    en: 'Tech Repairs',
    he: 'תיקונים',
    short: { en: 'Repair', he: 'תיקון' }
  },
  {
    value: 'events',
    en: 'Events',
    he: 'אירועים',
    short: { en: 'Events', he: 'אירוע' }
  },
  {
    value: 'beauty_fitness',
    en: 'Beauty & Fitness',
    he: 'יופי וכושר',
    short: { en: 'Beauty', he: 'יופי' }
  }
];

// ---------------------- Rental Categories ----------------------
export const rentalCategoryData = [
  {
    value: 'study_equipment',
    en: 'Study Equipment',
    he: 'ציוד לימודי',
    short: { en: 'Study', he: 'לימוד' }
  },
  {
    value: 'sports_equipment',
    en: 'Sports Equipment',
    he: 'ציוד ספורט',
    short: { en: 'Sport', he: 'ספורט' }
  },
  {
    value: 'home_items',
    en: 'Home Items',
    he: 'ציוד ביתי',
    short: { en: 'Home', he: 'ביתי' }
  },
  {
    value: 'transport',
    en: 'Transport',
    he: 'תחבורה קלה',
    short: { en: 'Trans', he: 'תחבורה' }
  },
  {
    value: 'event_gear',
    en: 'Event Gear',
    he: 'ציוד אירועים',
    short: { en: 'Event', he: 'ציוד' }
  },
  {
    value: 'entertainment',
    en: 'Entertainment',
    he: 'פנאי ובידור',
    short: { en: 'Fun', he: 'פנאי' }
  }
];

// ---------------------- Helper Functions ----------------------

export const getServiceCategoryOptions = (lang = 'en') =>
  serviceCategoryData.map((cat) => ({ value: cat.value, label: cat[lang] }));

export const getRentalCategoryOptions = (lang = 'en') =>
  rentalCategoryData.map((cat) => ({ value: cat.value, label: cat[lang] }));

export const getServiceSubcategoryOptions = () => [];
export const getRentalSubcategoryOptions = () => [];

export const getServiceCategoryFilterTags = (lang = 'en') =>
  serviceCategoryData.map((cat) => ({ value: cat.value, label: cat.short[lang] }));

export const getRentalCategoryFilterTags = (lang = 'en') =>
  rentalCategoryData.map((cat) => ({ value: cat.value, label: cat.short[lang] }));

export const getServiceSubcategoryFilterTags = () => [];
export const getRentalSubcategoryFilterTags = () => [];

// Extra rental categories for extended functionality
export const extraRentalCategoryData = [];

