// Unified category system for both rentals and services.
// Each category stores English and Hebrew labels along with a short label used in filters.

// ---------------------- Unified Categories ----------------------
const unifiedCategoryData = [
  {
    value: 'tools_equipment',
    en: 'Tools & Equipment',
    he: 'כלים וציוד',
    short: { en: 'Tools', he: 'כלים' }
  },
  {
    value: 'events_leisure',
    en: 'Events & Leisure',
    he: 'אירועים ופנאי',
    short: { en: 'Events', he: 'אירועים' }
  },
  {
    value: 'transport_mobility',
    en: 'Transport & Mobility',
    he: 'תחבורה וניידות',
    short: { en: 'Transport', he: 'תחבורה' }
  },
  {
    value: 'home_family_services',
    en: 'Home & Family Services',
    he: 'שירותי בית ומשפחה',
    short: { en: 'Home', he: 'בית' }
  },
  {
    value: 'education_personal_services',
    en: 'Education & Personal Services',
    he: 'חינוך ושירותים אישיים',
    short: { en: 'Education', he: 'חינוך' }
  },
  {
    value: 'technology_media',
    en: 'Technology & Media',
    he: 'טכנולוגיה ומדיה',
    short: { en: 'Tech', he: 'טכנולוגיה' }
  }
];

// ---------------------- Service Categories ----------------------
export const serviceCategoryData = unifiedCategoryData;

// ---------------------- Rental Categories ----------------------
export const rentalCategoryData = unifiedCategoryData;

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

// Extra service categories for extended functionality
export const extraServiceCategoryData = [];

