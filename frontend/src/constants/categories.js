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
    short: { en: 'Event', he: 'אירוע' }
  },
  {
    value: 'entertainment',
    en: 'Entertainment',
    he: 'פנאי ובידור',
    short: { en: 'Fun', he: 'פנאי' }
  }
];

// ---------------------- Extra Service Categories ----------------------
export const extraServiceCategoryData = [
  {
    value: 'cleaning',
    en: 'Cleaning',
    he: 'ניקיון',
    short: { en: 'Clean', he: 'ניקוי' }
  },
  {
    value: 'pet_care',
    en: 'Pet Care',
    he: 'דאגה לחיות מחמד',
    short: { en: 'Pets', he: 'חיות' }
  },
  {
    value: 'cooking_food',
    en: 'Cooking & Food',
    he: 'בישול ואוכל',
    short: { en: 'Food', he: 'בישול' }
  },
  {
    value: 'music_arts',
    en: 'Music & Arts',
    he: 'מוזיקה ואומנות',
    short: { en: 'Arts', he: 'אומנות' }
  },
  {
    value: 'gardening',
    en: 'Gardening',
    he: 'גינון',
    short: { en: 'Garden', he: 'גן' }
  },
  {
    value: 'handyman',
    en: 'Handyman',
    he: 'עבודות כלליות',
    short: { en: 'Fix', he: 'תיקון' }
  },
  {
    value: 'babysitting',
    en: 'Babysitting',
    he: 'שמרטפות',
    short: { en: 'Baby', he: 'שמרטף' }
  },
  {
    value: 'digital_services',
    en: 'Digital Services',
    he: 'שירותים דיגיטליים',
    short: { en: 'Digital', he: 'דיגי' }
  },
  {
    value: 'delivery_errands',
    en: 'Delivery & Errands',
    he: 'שליחויות וסידורים',
    short: { en: 'Delivery', he: 'שליח' }
  }
];

// ---------------------- Extra Rental Categories ----------------------
export const extraRentalCategoryData = [
  {
    value: 'tools_diy',
    en: 'Tools & DIY',
    he: 'כלי עבודה',
    short: { en: 'Tools', he: 'כלים' }
  },
  {
    value: 'camping_outdoors',
    en: 'Camping & Outdoors',
    he: 'קמפינג ושדה',
    short: { en: 'Camp', he: 'קמפינג' }
  },
  {
    value: 'photo_video',
    en: 'Photography & Video',
    he: 'צילום ווידאו',
    short: { en: 'Photo', he: 'צילום' }
  },
  {
    value: 'musical_instruments',
    en: 'Musical Instruments',
    he: 'כלי נגינה',
    short: { en: 'Music', he: 'נגינה' }
  },
  {
    value: 'party_supplies',
    en: 'Party Supplies',
    he: 'ציוד למסיבות',
    short: { en: 'Party', he: 'מסיבה' }
  },
  {
    value: 'electronics',
    en: 'Electronics & Gadgets',
    he: 'אלקטרוניקה',
    short: { en: 'Elec', he: 'אלק' }
  },
  {
    value: 'kids_toys',
    en: 'Kids & Toys',
    he: 'צעצועים וילדים',
    short: { en: 'Toys', he: 'צעצוע' }
  },
  {
    value: 'clothing_costumes',
    en: 'Clothing & Costumes',
    he: 'ביגוד ותחפושות',
    short: { en: 'Clothes', he: 'בגדים' }
  },
  {
    value: 'health_equipment',
    en: 'Health Equipment',
    he: 'ציוד בריאות וכושר',
    short: { en: 'Health', he: 'בריאות' }
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
  [...serviceCategoryData, ...extraServiceCategoryData].map((cat) => ({ value: cat.value, label: cat.short[lang] }));

export const getRentalCategoryFilterTags = (lang = 'en') =>
  [...rentalCategoryData, ...extraRentalCategoryData].map((cat) => ({ value: cat.value, label: cat.short[lang] }));

export const getServiceSubcategoryFilterTags = () => [];
export const getRentalSubcategoryFilterTags = () => [];

