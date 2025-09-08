// Bilingual category and tag definitions for rentals and services.
// Each tag stores English and Hebrew labels along with a short label used in filters.

// ---------------------- Service Categories ----------------------
export const serviceCategoryData = [
  {
    en: 'Tutoring',
    he: 'שיעורים',
    tags: [
      { en: 'Math', he: 'מתמטיקה', short: { en: 'Math', he: 'מתמטיקה' } },
      { en: 'Programming', he: 'תכנות', short: { en: 'Prog', he: 'תכנות' } },
      { en: 'Languages', he: 'שפות', short: { en: 'Lang', he: 'שפות' } },
    ],
  },
  {
    en: 'Summaries',
    he: 'שיעורי בית',
    tags: [
      { en: 'Notes', he: 'סיכומים', short: { en: 'Notes', he: 'סיכומים' } },
      { en: 'Seminar Papers', he: 'עבודות סמינר', short: { en: 'Seminar', he: 'סמינר' } },
      { en: 'Editing', he: 'עריכה', short: { en: 'Edit', he: 'עריכה' } },
    ],
  },
  {
    en: 'Transport',
    he: 'הובלה',
    tags: [
      { en: 'Small Moves', he: 'הובלות קטנות', short: { en: 'Moves', he: 'הובלה' } },
      { en: 'Carpool', he: 'קארפול', short: { en: 'Carpool', he: 'קארפול' } },
      { en: 'Errands', he: 'שליחויות', short: { en: 'Errands', he: 'שליח' } },
    ],
  },
  {
    en: 'Care',
    he: 'טיפול',
    tags: [
      { en: 'Pets', he: 'חיות', short: { en: 'Pets', he: 'חיות' } },
      { en: 'Plants', he: 'צמחים', short: { en: 'Plants', he: 'צמחים' } },
      { en: 'Cleaning', he: 'ניקיון', short: { en: 'Clean', he: 'ניקיון' } },
    ],
  },
  {
    en: 'Tech Repairs',
    he: 'תיקונים',
    tags: [
      { en: 'Computers', he: 'מחשבים', short: { en: 'PCs', he: 'מחשבים' } },
      { en: 'Phones', he: 'טלפונים', short: { en: 'Phones', he: 'טלפונים' } },
      { en: 'Software Help', he: 'עזרה בתוכנה', short: { en: 'Software', he: 'תוכנה' } },
    ],
  },
  {
    en: 'Events',
    he: 'אירועים',
    tags: [
      { en: 'Photography', he: 'צילום', short: { en: 'Photo', he: 'צילום' } },
      { en: 'Music/DJ', he: 'מוזיקה/תקליטן', short: { en: 'Music', he: 'מוזיקה' } },
      { en: 'Organization', he: 'ארגון', short: { en: 'Org', he: 'ארגון' } },
    ],
  },
  {
    en: 'Beauty & Fitness',
    he: 'יופי וכושר',
    tags: [
      { en: 'Hair', he: 'שיער', short: { en: 'Hair', he: 'שיער' } },
      { en: 'Cosmetics', he: 'קוסמטיקה', short: { en: 'Cosmo', he: 'קוסמטיקה' } },
      { en: 'Gym Coaching', he: 'אימון כושר', short: { en: 'Gym', he: 'אימון' } },
    ],
  },
];

// ---------------------- Rental Categories ----------------------
export const rentalCategoryData = [
  {
    en: 'Study Equipment',
    he: 'ציוד לימודי',
    tags: [
      { en: 'Laptop', he: 'מחשב נייד', short: { en: 'Laptop', he: 'מחשב' } },
      { en: 'Projector', he: 'מקרן', short: { en: 'Proj', he: 'מקרן' } },
      { en: 'Calculator', he: 'מחשבון', short: { en: 'Calc', he: 'מחשבון' } },
      { en: 'Books', he: 'ספרים', short: { en: 'Books', he: 'ספרים' } },
    ],
  },
  {
    en: 'Sports Equipment',
    he: 'ציוד ספורט',
    tags: [
      { en: 'Balls', he: 'כדורים', short: { en: 'Balls', he: 'כדורים' } },
      { en: 'Yoga Mat', he: 'מזרן יוגה', short: { en: 'Yoga', he: 'יוגה' } },
      { en: 'Weights', he: 'משקולות', short: { en: 'Weights', he: 'משק' } },
      { en: 'Rackets', he: 'מחבטים', short: { en: 'Rackets', he: 'מחבט' } },
    ],
  },
  {
    en: 'Home Items',
    he: 'ציוד ביתי',
    tags: [
      { en: 'Kitchen Tools', he: 'כלי מטבח', short: { en: 'Kitchen', he: 'מטבח' } },
      { en: 'Vacuum', he: 'שואב אבק', short: { en: 'Vacuum', he: 'שואב' } },
      { en: 'Small Tools', he: 'כלי עבודה קטנים', short: { en: 'Tools', he: 'כלים' } },
    ],
  },
  {
    en: 'Transport',
    he: 'תחבורה קלה',
    tags: [
      { en: 'Bicycle', he: 'אופניים', short: { en: 'Bike', he: 'אופניים' } },
      { en: 'Scooter', he: 'קורקינט', short: { en: 'Scooter', he: 'קורק' } },
      { en: 'Skateboard', he: 'סקייטבורד', short: { en: 'Skate', he: 'סקייט' } },
    ],
  },
  {
    en: 'Event Gear',
    he: 'ציוד אירועים',
    tags: [
      { en: 'Speakers', he: 'רמקולים', short: { en: 'Speak', he: 'רמקול' } },
      { en: 'Lights', he: 'אורות', short: { en: 'Lights', he: 'אורות' } },
      { en: 'Cameras', he: 'מצלמות', short: { en: 'Camera', he: 'מצלמה' } },
      { en: 'Board Games', he: 'משחקי שולחן', short: { en: 'Games', he: 'משחק' } },
    ],
  },
  {
    en: 'Entertainment',
    he: 'פנאי ובידור',
    tags: [
      { en: 'Console', he: 'קונסולה', short: { en: 'Console', he: 'קונסולה' } },
      { en: 'Novels', he: 'ספרי קריאה', short: { en: 'Novels', he: 'ספרים' } },
      { en: 'Camping Gear', he: 'ציוד קמפינג', short: { en: 'Camping', he: 'קמפינג' } },
    ],
  },
];

// ---------------------- Helper Functions ----------------------

const flattenTags = (data) =>
  data.flatMap((cat) => cat.tags.map((tag) => ({ ...tag })));

export const getServiceTagOptions = (lang = 'en') =>
  serviceCategoryData.flatMap((cat) =>
    cat.tags.map((tag) => ({ value: tag.en, label: tag[lang] }))
  );

export const getRentalTagOptions = (lang = 'en') =>
  rentalCategoryData.flatMap((cat) =>
    cat.tags.map((tag) => ({ value: tag.en, label: tag[lang] }))
  );

export const getServiceFilterTags = (lang = 'en') =>
  serviceCategoryData.flatMap((cat) =>
    cat.tags.map((tag) => ({ value: tag.en, label: tag.short[lang] }))
  );

export const getRentalFilterTags = (lang = 'en') =>
  rentalCategoryData.flatMap((cat) =>
    cat.tags.map((tag) => ({ value: tag.en, label: tag.short[lang] }))
  );

// Export flattened tag lists (English values) for backend use if needed
export const serviceTags = flattenTags(serviceCategoryData);
export const rentalTags = flattenTags(rentalCategoryData);

