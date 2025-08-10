import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuthContext } from './context/AuthContext';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import GoogleMapsLoader from './components/GoogleMapsLoader';
import ErrorBoundary from './ErrorBoundary';
import Layout from './components/Layout';
import RentalsMapPage from './components/HomePage/RentalsMapPage';
import ServicesMapPage from './components/HomePage/ServicesMapPage';
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
import splashLogo from '../images/logogood.png';

function App() {
  const { user } = useAuthContext();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timerId = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timerId);
  }, []);

  if (showSplash) {
    return (
      <div className="splash-screen">
        <img src={splashLogo} alt="GIVIT" />
      </div>
    );
  }
  return (
    <GoogleMapsLoader>
      <Router>
        <ErrorBoundary>
        <I18nextProvider i18n={i18n}>
        <div className="app-container">
          <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<RentalsMapPage />} />
                <Route path="/services" element={<ServicesMapPage />} />
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
                <Route path="/auth-handler" element={<MobileAuthHandler />} />
             </Route>
            </Routes>
          </div>
          </I18nextProvider>
         </ErrorBoundary>
        </Router>
        </GoogleMapsLoader>
  );
}

export default App;