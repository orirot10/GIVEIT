import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from './context/AuthContext';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import GoogleMapsLoader from './components/GoogleMapsLoader';
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
import NotificationHandler from './components/NotificationHandler';
import PermissionRequest from './components/PermissionRequest';
import notificationService from './services/notificationService';

function App() {
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
        // Clean up notifications when user logs out
        await notificationService.cleanup();
      }
    };

    // Add a small delay to ensure the app is fully loaded
    const timer = setTimeout(initializeNotifications, 1000);
    return () => clearTimeout(timer);
  }, [user]);

  return (
    <GoogleMapsLoader>
      <MapProvider>
        <Router>
          <ErrorBoundary>
          <I18nextProvider i18n={i18n}>
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

                  <Route path="/auth-handler" element={<MobileAuthHandler />} />
               </Route>
              </Routes>
            </div>
            </I18nextProvider>
           </ErrorBoundary>
          </Router>
      </MapProvider>
    </GoogleMapsLoader>
  );
}

export default App;
