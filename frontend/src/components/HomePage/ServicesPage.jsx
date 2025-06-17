import React from "react";
import GenericMapPage from "./GenericMapPage";
import { useTranslation } from 'react-i18next';

const ServicesPage = () => {
    const { t } = useTranslation();
    return (
        <GenericMapPage
            apiUrl={`${import.meta.env.VITE_API_URL}/api/services`}
            title={t("Services")}
        />
    );
};

export default ServicesPage; 