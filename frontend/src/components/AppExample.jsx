// Working App.jsx example with onboarding overlay
import React, { useState, useEffect } from 'react';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { Preferences } from '@capacitor/preferences';
import i18n from '../i18n';
import Onboarding from './Onboarding';

// Your main app content component
const MainApp = () => {
  return (
    <div style={{ padding: '20px', minHeight: '100vh', background: '#f5f5f5' }}>
      <h1>Givit App</h1>
      <p>Main app content is always rendered here...</p>
      <div style={{ marginTop: '20px' }}>
        <button onClick={() => resetOnboarding()}>Reset Onboarding (for testing)</button>
      </div>
    </div>
  );
};

// Reset function for testing
const resetOnboarding = async () => {
  try {
    await Preferences.remove({ key: 'givit_onboarding_done' });
    window.location.reload();
  } catch (error) {
    console.error('Error resetting onboarding:', error);
  }
};

const AppContent = () => {
  const { i18n } = useTranslation();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const result = await Preferences.get({ key: 'givit_onboarding_done' });
        const hasSeenOnboarding = result.value === 'true';
        setShowOnboarding(!hasSeenOnboarding);
      } catch (error) {
        console.error('Error checking onboarding:', error);
        setShowOnboarding(true); // Show onboarding on error
      } finally {
        setIsLoading(false);
      }
    };

    checkOnboarding();
  }, []);

  const handleOnboardingClose = () => {
    setShowOnboarding(false);
  };

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        Loading...
      </div>
    );
  }

  return (
    <>
      {/* Main app always renders */}
      <MainApp />
      
      {/* Onboarding overlay only when needed */}
      {showOnboarding && (
        <Onboarding 
          lang={i18n.language} 
          onClose={handleOnboardingClose}
        />
      )}
    </>
  );
};

const App = () => {
  return (
    <I18nextProvider i18n={i18n}>
      <AppContent />
    </I18nextProvider>
  );
};

export default App;