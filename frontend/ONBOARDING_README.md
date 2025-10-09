# Givit App Onboarding Implementation

## Overview
A bilingual (Hebrew + English) onboarding screen for the Givit app built with React + Bootstrap + Capacitor.

## Features
- ✅ Appears only on first app launch
- ✅ Uses Capacitor Preferences to store completion flag
- ✅ Bootstrap Carousel with 3 slides
- ✅ RTL/LTR layout switching based on language
- ✅ Clean, modern design with Givit colors (#00897B)
- ✅ Mobile responsive layout
- ✅ Localized texts in Hebrew and English

## Files Created

### Components
- `src/components/Onboarding.jsx` - Main onboarding component
- `src/components/onboarding.css` - Styling for onboarding
- `src/components/OnboardingExample.jsx` - Example integration snippet

### Hooks
- `src/hooks/useOnboarding.js` - Custom hook for managing onboarding state

### Translations
- Added onboarding translations to `src/he.json` and `src/en.json`

## Usage

The onboarding component is automatically integrated into the main App.jsx. It will:

1. Check if onboarding has been completed using Capacitor Preferences
2. Show onboarding screen if not completed
3. Save completion flag when user clicks "Start"
4. Show main app content after completion

### Manual Usage

```jsx
import Onboarding from './components/Onboarding';
import { useTranslation } from 'react-i18next';

const MyApp = () => {
  const { i18n } = useTranslation();
  
  return (
    <Onboarding 
      lang={i18n.language} // 'he' or 'en'
      setOnboardingSeen={() => {
        // Handle onboarding completion
        console.log('Onboarding completed');
      }}
    />
  );
};
```

## Slide Content

### Slide 1
- **Hebrew**: "ברוך הבא ל-Givit 💚 — אפליקציה שמחברת בין אנשים שמציעים עזרה, מוצרים או שירותים לבין כאלה שמבקשים."
- **English**: "Welcome to Givit 💚 — the app that connects people who offer help, products, or services with those who need them."

### Slide 2
- **Hebrew**: "הצעות ובקשות — בלשונית הצעות תראה מה אנשים מציעים, ובבקשות תוכל לפרסם מה אתה מחפש."
- **English**: "Offers and Requests — In the 'Offers' tab you'll see what people are offering, and in 'Requests' you can post what you're looking for."

### Slide 3
- **Hebrew**: "שירותים ומוצרים — בשירותים תמצא עזרה, שיעורים ותיקונים; במוצרים תוכל למסור או לבקש פריטים יד שנייה."
- **English**: "Services and Products — 'Services' include help, lessons, or repairs; 'Products' are for giving or requesting second-hand items."

## Dependencies Added
- `@capacitor/preferences@^6.0.0` - For storing onboarding completion flag
- `bootstrap` - For carousel component and styling

## Technical Details

### Storage
- Uses Capacitor Preferences with key `givit_onboarding_done`
- Value `'true'` indicates onboarding completed

### Styling
- Teal gradient background (#00897B to #4DB6AC)
- White content card with rounded corners
- Mobile-first responsive design
- RTL support for Hebrew text

### Accessibility
- Proper ARIA labels for carousel controls
- Keyboard navigation support
- Screen reader friendly

## Testing
To reset onboarding for testing:
```javascript
import { Preferences } from '@capacitor/preferences';

// Reset onboarding
await Preferences.remove({ key: 'givit_onboarding_done' });
```