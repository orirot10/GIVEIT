// Bilingual category and tag definitions for rentals and services.
// Each tag stores English and Hebrew labels along with a short label used in filters.

// ---------------------- Service Categories ----------------------
export const serviceCategoryData = [
  {
    value: 'tutoring',
    en: 'Tutoring',
    he: 'שיעורים',
    short: { en: 'Tut', he: 'שיעור' },
    subcategories: [
      { value: 'math', en: 'Math', he: 'מתמטיקה', short: { en: 'Math', he: 'מתמטיקה' } },
      { value: 'programming', en: 'Programming', he: 'תכנות', short: { en: 'Prog', he: 'תכנות' } },
      { value: 'languages', en: 'Languages', he: 'שפות', short: { en: 'Lang', he: 'שפות' } },
    ],
  },
  {
    value: 'summaries',
    en: 'Summaries',
    he: 'שיעורי בית',
    short: { en: 'Summ', he: 'שיעור' },
    subcategories: [
      { value: 'notes', en: 'Notes', he: 'הערות', short: { en: 'Notes', he: 'הערות' } },
      { value: 'seminar_papers', en: 'Seminar Papers', he: 'עבודות סמינריוניות', short: { en: 'Seminar', he: 'סמינר' } },
      { value: 'editing', en: 'Editing', he: 'עריכה', short: { en: 'Edit', he: 'עריכה' } },
    ],
  },
  {
    value: 'transport',
    en: 'Transport',
    he: 'הובלה',
    short: { en: 'Trans', he: 'הובלה' },
    subcategories: [
      { value: 'small_moves', en: 'Small Moves', he: 'הובלות קטנות', short: { en: 'Moves', he: 'קטנות' } },
      { value: 'carpool', en: 'Carpool', he: 'הסעות', short: { en: 'Carpool', he: 'הסעות' } },
      { value: 'errands', en: 'Errands', he: 'סידורים', short: { en: 'Errands', he: 'סידורים' } },
    ],
  },
  {
    value: 'care',
    en: 'Care',
    he: 'טיפול',
    short: { en: 'Care', he: 'טיפול' },
    subcategories: [
      { value: 'pet_care', en: 'Pet Care', he: 'טיפול בחיות', short: { en: 'Pets', he: 'חיות' } },
      { value: 'plant_care', en: 'Plant Care', he: 'טיפול בצמחים', short: { en: 'Plants', he: 'צמחים' } },
      { value: 'cleaning', en: 'Cleaning', he: 'ניקיון', short: { en: 'Clean', he: 'ניקיון' } },
    ],
  },
  {
    value: 'tech_repairs',
    en: 'Tech Repairs',
    he: 'תיקונים',
    short: { en: 'Repair', he: 'תיקון' },
    subcategories: [
      { value: 'computers', en: 'Computers', he: 'מחשבים', short: { en: 'PCs', he: 'מחשבים' } },
      { value: 'phones', en: 'Phones', he: 'טלפונים', short: { en: 'Phones', he: 'טלפונים' } },
      { value: 'software_help', en: 'Software Help', he: 'תמיכת תוכנה', short: { en: 'Software', he: 'תוכנה' } },
    ],
  },
  {
    value: 'events',
    en: 'Events',
    he: 'אירועים',
    short: { en: 'Events', he: 'אירוע' },
    subcategories: [
      { value: 'photography', en: 'Photography', he: 'צילום', short: { en: 'Photo', he: 'צילום' } },
      { value: 'music_dj', en: 'Music/DJ', he: 'מוזיקה ודי-ג\'יי', short: { en: 'Music', he: 'מוזיקה' } },
      { value: 'event_planning', en: 'Event Planning', he: 'ארגון אירועים', short: { en: 'Plan', he: 'ארגון' } },
    ],
  },
  {
    value: 'beauty_fitness',
    en: 'Beauty & Fitness',
    he: 'יופי וכושר',
    short: { en: 'Beauty', he: 'יופי' },
    subcategories: [
      { value: 'hair', en: 'Hair', he: 'שיער', short: { en: 'Hair', he: 'שיער' } },
      { value: 'cosmetics', en: 'Cosmetics', he: 'קוסמטיקה', short: { en: 'Cosmo', he: 'קוסמ' } },
      { value: 'gym_coaching', en: 'Gym Coaching', he: 'אימון כושר', short: { en: 'Gym', he: 'כושר' } },
    ],
  },
];

// ---------------------- Rental Categories ----------------------
export const rentalCategoryData = [
  {
    value: 'study_equipment',
    en: 'Study Equipment',
    he: 'ציוד לימודי',
    short: { en: 'Study', he: 'לימוד' },
    subcategories: [
      { value: 'laptop', en: 'Laptop', he: 'מחשב נייד', short: { en: 'Laptop', he: 'מחשב' } },
      { value: 'projector', en: 'Projector', he: 'מקרן', short: { en: 'Proj', he: 'מקרן' } },
      { value: 'calculator', en: 'Calculator', he: 'מחשבון', short: { en: 'Calc', he: 'מחשבון' } },
      { value: 'books', en: 'Books', he: 'ספרים', short: { en: 'Books', he: 'ספרים' } },
    ],
  },
  {
    value: 'sports_equipment',
    en: 'Sports Equipment',
    he: 'ציוד ספורט',
    short: { en: 'Sport', he: 'ספורט' },
    subcategories: [
      { value: 'balls', en: 'Balls', he: 'כדורים', short: { en: 'Balls', he: 'כדורים' } },
      { value: 'yoga_mat', en: 'Yoga Mat', he: 'מזרן יוגה', short: { en: 'Yoga', he: 'יוגה' } },
      { value: 'weights', en: 'Weights', he: 'משקולות', short: { en: 'Weights', he: 'משק' } },
      { value: 'rackets', en: 'Rackets', he: 'מחבטות', short: { en: 'Rackets', he: 'מחבט' } },
    ],
  },
  {
    value: 'home_items',
    en: 'Home Items',
    he: 'ציוד ביתי',
    short: { en: 'Home', he: 'ביתי' },
    subcategories: [
      { value: 'kitchen_tools', en: 'Kitchen Tools', he: 'כלי מטבח', short: { en: 'Kitchen', he: 'מטבח' } },
      { value: 'vacuum', en: 'Vacuum', he: 'שואב אבק', short: { en: 'Vacuum', he: 'שואב' } },
      { value: 'small_tools', en: 'Small Tools', he: 'כלים קטנים', short: { en: 'Tools', he: 'כלים' } },
    ],
  },
  {
    value: 'transport',
    en: 'Transport',
    he: 'תחבורה קלה',
    short: { en: 'Trans', he: 'תחבורה' },
    subcategories: [
      { value: 'bicycle', en: 'Bicycle', he: 'אופניים', short: { en: 'Bike', he: 'אופניים' } },
      { value: 'scooter', en: 'Scooter', he: 'קורקינט', short: { en: 'Scooter', he: 'קורק' } },
      { value: 'skateboard', en: 'Skateboard', he: 'סקייטבורד', short: { en: 'Skate', he: 'סקייט' } },
    ],
  },
  {
    value: 'event_gear',
    en: 'Event Gear',
    he: 'ציוד אירועים',
    short: { en: 'Event', he: 'אירוע' },
    subcategories: [
      { value: 'speakers', en: 'Speakers', he: 'רמקולים', short: { en: 'Speak', he: 'רמקול' } },
      { value: 'lights', en: 'Lights', he: 'תאורה', short: { en: 'Lights', he: 'תאורה' } },
      { value: 'cameras', en: 'Cameras', he: 'מצלמות', short: { en: 'Camera', he: 'מצלמה' } },
      { value: 'games', en: 'Games', he: 'משחקים', short: { en: 'Games', he: 'משחק' } },
    ],
  },
  {
    value: 'entertainment',
    en: 'Entertainment',
    he: 'פנאי ובידור',
    short: { en: 'Fun', he: 'פנאי' },
    subcategories: [
      { value: 'gaming_console', en: 'Gaming Console', he: 'קונסולת משחקים', short: { en: 'Console', he: 'קונסולה' } },
      { value: 'novels', en: 'Novels', he: 'ספרי קריאה', short: { en: 'Novels', he: 'ספרים' } },
      { value: 'camping_gear', en: 'Camping Gear', he: 'ציוד קמפינג', short: { en: 'Camping', he: 'קמפינג' } },
    ],
  },
];

// ---------------------- Helper Functions ----------------------

const flattenSubcategories = (data) =>
  data.flatMap((cat) => cat.subcategories.map((sub) => ({ ...sub })));

export const getServiceCategoryOptions = (lang = 'en') =>
  serviceCategoryData.map((cat) => ({ value: cat.value, label: cat[lang] }));

export const getRentalCategoryOptions = (lang = 'en') =>
  rentalCategoryData.map((cat) => ({ value: cat.value, label: cat[lang] }));

export const getServiceSubcategoryOptions = (category, lang = 'en') => {
  const cat = serviceCategoryData.find((c) => c.value === category);
  return cat ? cat.subcategories.map((sub) => ({ value: sub.value, label: sub[lang] })) : [];
};

export const getRentalSubcategoryOptions = (category, lang = 'en') => {
  const cat = rentalCategoryData.find((c) => c.value === category);
  return cat ? cat.subcategories.map((sub) => ({ value: sub.value, label: sub[lang] })) : [];
};

export const getServiceCategoryFilterTags = (lang = 'en') =>
  serviceCategoryData.map((cat) => ({ value: cat.value, label: cat.short[lang] }));

export const getRentalCategoryFilterTags = (lang = 'en') =>
  rentalCategoryData.map((cat) => ({ value: cat.value, label: cat.short[lang] }));

export const getServiceSubcategoryFilterTags = (category, lang = 'en') => {
  const cat = serviceCategoryData.find((c) => c.value === category);
  return cat ? cat.subcategories.map((sub) => ({ value: sub.value, label: sub.short[lang] })) : [];
};

export const getRentalSubcategoryFilterTags = (category, lang = 'en') => {
  const cat = rentalCategoryData.find((c) => c.value === category);
  return cat ? cat.subcategories.map((sub) => ({ value: sub.value, label: sub.short[lang] })) : [];
};

// Export flattened subcategory lists for backend use if needed
export const serviceSubcategories = flattenSubcategories(serviceCategoryData);
export const rentalSubcategories = flattenSubcategories(rentalCategoryData);

