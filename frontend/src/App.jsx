import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from './context/AuthContext';
import { I18nextProvider, useTranslation } from 'react-i18next';
import i18n from './i18n';
import GoogleMapsLoader from './components/GoogleMapsLoader';
import MapPreloader from './components/MapPreloader';
import ErrorBoundary from './ErrorBoundary';
import Layout from './components/Layout';
import RentalsMapPage from './components/HomePage/RentalsMapPage';
import ServicesMapPage from './components/HomePage/ServicesMapPage';
import { MapProvider } from './context/MapContext';
import Account from './pages/account';
import Dashboard from './pages/Dashboard';
import EditProfile from './pages/EditProfile';
import SignUp from './components/Auth/SignUp';
import LoginForm from './components/Auth/LoginForm';
import RentalForm from './components/UploadForm/RentalForm';
import RequestRentalForm from './components/RequestRental/RequestRentalForm';
import MyModals from './components/MyItems/MyModals';
import MessagesPage from './pages/Messages';
import ServiceForm from './components/UploadForm/ServiceForm';
import RequestServiceForm from './components/RequestService/RequestServiceForm';
import MobileAuthHandler from './components/Auth/MobileAuthHandler';
import Terms from "./pages/Terms";
import PrivacyPolicy from './pages/PrivacyPolicy';
import NotificationHandler from './components/NotificationHandler';
import PermissionRequest from './components/PermissionRequest';
import notificationService from './services/notificationService';
import Onboarding from './components/Onboarding';
import { useOnboarding } from './hooks/useOnboarding';

// Main App Component that always renders
const MainApp = () => {
  const { user } = useAuthContext();

  useEffect(() => {
    const initializeNotifications = async () => {
      if (user) {
        console.log('Initializing notifications for user:', user.uid);
        const success = await notificationService.initialize();
        if (success) {
          console.log('Push notifications initialized successfully');
        } else {
          console.log('Failed to initialize push notifications');
        }
      } else {
        await notificationService.cleanup();
      }
    };

    const timer = setTimeout(initializeNotifications, 1000);
    return () => clearTimeout(timer);
  }, [user]);

  return (
    <GoogleMapsLoader>
      <MapProvider>
        <MapPreloader />
        <Router>
          <ErrorBoundary>
            <NotificationHandler />
            <PermissionRequest onPermissionGranted={() => notificationService.initialize()} />
            <div className="app-container">
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<ServicesMapPage />} />
                  <Route path="/services" element={<ServicesMapPage />} />
                  <Route path="/rentals" element={<RentalsMapPage />} />
                  <Route path="/account" element={user ? <Navigate to="/dashboard" /> : <Account />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/edit-profile" element={<EditProfile />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginForm />} />
                  <Route path="/offer-rental" element={<RentalForm />} />
                  <Route path="/request-rental" element={<RequestRentalForm />} />
                  <Route path="/my-items" element={<MyModals />} />
                  <Route path="/messages" element={<MessagesPage />} />
                  <Route path="/offer-service" element={<ServiceForm />} />
                  <Route path="/request-service" element={<RequestServiceForm />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/auth-handler" element={<MobileAuthHandler />} />
                </Route>
              </Routes>
            </div>
          </ErrorBoundary>
        </Router>
      </MapProvider>
    </GoogleMapsLoader>
  );
};

function AppContent() {
  const { i18n } = useTranslation();
  const { onboardingSeen, markOnboardingAsSeen, isLoading } = useOnboarding();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (!isLoading && !onboardingSeen) {
      setShowOnboarding(true);
    }
  }, [isLoading, onboardingSeen]);

  const handleOnboardingClose = () => {
    setShowOnboarding(false);
    markOnboardingAsSeen();
  };

  return (
    <>
      <MainApp />
      {showOnboarding && (
        <Onboarding 
          lang={i18n.language} 
          onClose={handleOnboardingClose}
        />
      )}
    </>
  );
}

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <AppContent />
    </I18nextProvider>
  );
}

export default App;
