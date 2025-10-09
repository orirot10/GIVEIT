import { useState, useEffect } from 'react';
import { Preferences } from '@capacitor/preferences';

export const useOnboarding = () => {
  const [onboardingSeen, setOnboardingSeen] = useState(null); // null = loading, true/false = result

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const result = await Preferences.get({ key: 'givit_onboarding_done' });
        setOnboardingSeen(result.value === 'true');
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        setOnboardingSeen(false); // Default to showing onboarding on error
      }
    };

    checkOnboarding();
  }, []);

  const markOnboardingAsSeen = () => {
    setOnboardingSeen(true);
  };

  return {
    onboardingSeen,
    markOnboardingAsSeen,
    isLoading: onboardingSeen === null
  };
};