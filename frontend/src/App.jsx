import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React from 'react';
import Layout from './components/Layout';
import Account from './pages/account.jsx';
import ErrorBoundary from './ErrorBoundary.jsx';
import Dashboard from './pages/Dashboard.jsx';
import SignUp from './components/Auth/SignUp.jsx';
import './styles/global.css';
import RentalForm from './components/UploadForm/RentalForm.jsx';
import MyModals from './components/MyItems/MyModals.jsx';
import MessagesPage from './pages/Messages';
import ServiceForm from './components/UploadForm/ServiceForm';
import RentalsMapPage from './components/HomePage/RentalsMapPage.jsx';
import ServicesMapPage from './components/HomePage/ServicesMapPage.jsx';
import { useAuthContext } from './context/AuthContext';
import GoogleMapsLoader from './components/GoogleMapsLoader.jsx';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

function App() {
  const { user } = useAuthContext();
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
                <Route path="/signup" element={<SignUp />} />
                <Route path="/offer-rental" element={<RentalForm />} />
                <Route path="/my-items" element={<MyModals />} />
                <Route path="/messages" element={<MessagesPage />} />
                {/* <Route path="/messages" element={<MessagesPage />} /> */}
                <Route path="/offer-service" element={<ServiceForm />} />
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