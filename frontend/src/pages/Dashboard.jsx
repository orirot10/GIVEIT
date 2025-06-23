import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../styles/Dashboard.css';
import { useAuthContext } from '../context/AuthContext';
import ListingForm from '../components/ListingForm';

function Dashboard() {
    const { user, logout } = useAuthContext();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'he';
    const [showRentalForm, setShowRentalForm] = useState(false);
    const [showServiceForm, setShowServiceForm] = useState(false);

    const handleRentalRequest = () => navigate('/request-rental');
    const handleServiceRequest = () => navigate('/request-service');
    const handleOfferRental = () => navigate('/offer-rental');
    const  handleOfferService = () => navigate('/offer-service')
    const handleEditProfile = () => navigate('/edit-profile');
    const handleMessages = () => navigate('/messages');

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/account');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const handleListingSuccess = (listing) => {
        console.log('Listing created:', listing);
        setShowRentalForm(false);
        setShowServiceForm(false);
        // Optionally show success message or redirect
    };

    if (!user) {
        return <div dir={isRTL ? 'rtl' : 'ltr'}>{t('auth.login_required')}</div>;
    }

    return (
        <div className="dashboard-container custom-dashboard-bg" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="dashboard-header">
                <h2 className="dashboard-username">Welcome, {user.displayName || `${user.firstName || ''} ${user.lastName || ''}`}</h2>
                {(user.city || user.address) && (
                    <div className="dashboard-address">
                        {user.city || user.address}
                    </div>
                )}
            </div>
            <div className="dashboard-sections">
                <div className="dashboard-section">
                    <h3 className="dashboard-section-title">Rentals</h3>
                    <div className="dashboard-section-buttons">
                        <button className="primary-btn dashboard-btn" onClick={() => handleOfferRental(true)}>
                            Offer Rental
                        </button>
                        <button className="primary-btn dashboard-btn" onClick={handleRentalRequest}>
                            Request Rental
                        </button>
                    </div>
                </div>
                <div className="dashboard-section">
                    <h3 className="dashboard-section-title">Services</h3>
                    <div className="dashboard-section-buttons">
                        <button className="primary-btn dashboard-btn" onClick={() => handleOfferService(true)}>
                            Offer Service
                        </button>
                        <button className="primary-btn dashboard-btn" onClick={handleServiceRequest}>
                            Request Service
                        </button>
                    </div>
                </div>
                <div className="dashboard-section">
                    <h3 className="dashboard-section-title">Account</h3>
                    <div className="dashboard-section-buttons">
                        <button className="outlined-btn dashboard-btn" onClick={handleEditProfile}>
                            Edit Profile
                        </button>
                        <button className="outlined-btn dashboard-btn" onClick={handleMessages}>
                            Messages
                        </button>
                        <button className="logout-btn dashboard-btn" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {showRentalForm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button 
                            className="close-btn" 
                            onClick={() => setShowRentalForm(false)}
                        >
                            ×
                        </button>
                        <ListingForm 
                            type="rental" 
                            onSuccess={handleListingSuccess}
                        />
                    </div>
                </div>
            )}

            {showServiceForm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button 
                            className="close-btn" 
                            onClick={() => setShowServiceForm(false)}
                        >
                            ×
                        </button>
                        <ListingForm 
                            type="service" 
                            onSuccess={handleListingSuccess}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default Dashboard;