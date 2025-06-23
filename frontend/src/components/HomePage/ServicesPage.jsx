import React from "react";
import GenericMapPage from "./GenericMapPage";
import { useTranslation } from 'react-i18next';

const ServicesPage = () => {
    const { t, i18n } = useTranslation();
    return (
        <GenericMapPage
            apiUrl={`${import.meta.env.VITE_API_URL}/api/services`}
            title={i18n.language === 'he' ? t('Services') : 'Services'}
        />
    );
};

export default ServicesPage; 