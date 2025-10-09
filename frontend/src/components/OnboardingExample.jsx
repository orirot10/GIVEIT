// Example integration snippet for using the Onboarding component
import React, { useState, useEffect } from 'react';
import { Preferences } from '@capacitor/preferences';
import Onboarding from './Onboarding';
import { useTranslation } from 'react-i18next';

const ExampleApp = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { i18n } = useTranslation();

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const result = await Preferences.get({ key: 'givit_onboarding_done' });
        setShowOnboarding(result.value !== 'true');
      } catch (error) {
        console.error('Error checking onboarding:', error);
        setShowOnboarding(true); // Show onboarding on error
      } finally {
        setIsLoading(false);
      }
    };

    checkOnboarding();
  }, []);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (showOnboarding) {
    return (
      <Onboarding 
        lang={i18n.language} // 'he' or 'en'
        setOnboardingSeen={handleOnboardingComplete}
      />
    );
  }

  return (
    <div>
      {/* Your main app content here */}
      <h1>Main App Content</h1>
    </div>
  );
};

export default ExampleApp;