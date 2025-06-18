import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../styles/Dashboard.css';
import { useAuthContext } from '../context/AuthContext';

function Dashboard() {
    const { user, dispatch } = useAuthContext();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'he';

    const handleRentalOffer = () => navigate('/offer-rental');
    const handleServiceOffer = () => navigate('/offer-service');
    const handleRentalRequest = () => navigate('/request-rental');
    const handleServiceRequest = () => navigate('/request-service');

    const handleLogout = () => {
        localStorage.removeItem('token');
        dispatch({ type: "LOGOUT" });
        navigate('/account');
    };

    if (!user) {
        return <div dir={isRTL ? 'rtl' : 'ltr'}>{t('auth.login_required')}</div>;
    }

    return (
        <div className="dashboard-container" dir={isRTL ? 'rtl' : 'ltr'}>
            <h2>{t('welcome', { firstName: user.user.firstName, lastName: user.user.lastName })}</h2>
            <p>{t('common.email')}: {user.user.email}</p>
            <p>{t('common.city')}: {user.user.city}</p>
            <p>{t('common.street')}: {user.user.street}</p>
            <button className="toggle-view-btn" onClick={handleRentalOffer}>
                {t('offer rental')}
            </button>
            <button className="toggle-view-btn" onClick={handleRentalRequest}>
                {t('request rental')}
            </button>
            <button className="toggle-view-btn" onClick={handleServiceOffer}>
                {t('offer service')}
            </button>
            <button className="toggle-view-btn" onClick={handleServiceRequest}>
                {t('request service')}
            </button>
            <button className="toggle-view-btn">
                {t('edit profile')}
            </button>
            <button className="toggle-view-btn logout" onClick={handleLogout}>
                {t('auth.logout')}
            </button>
        </div>
    );
}

export default Dashboard;