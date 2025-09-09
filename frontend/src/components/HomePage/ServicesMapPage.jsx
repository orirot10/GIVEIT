import React from "react";
import PersistentMapPage from "./PersistentMapPage";
import { useTranslation } from 'react-i18next';

const ServicesMapPage = () => {
    const { t, i18n } = useTranslation();
    return (
        <PersistentMapPage
            apiUrl={`${import.meta.env.VITE_API_URL || 'https://giveit-backend.onrender.com'}/api/services`}
            title={i18n.language === 'he' ? t('Explore Services') : 'Explore Services'}
        />
    );
};

export default ServicesMapPage;