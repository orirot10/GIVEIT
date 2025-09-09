import React from "react";
import PersistentMapPage from "./PersistentMapPage";
import { useTranslation } from 'react-i18next';

const RentalsMapPage = () => {
    const { t } = useTranslation();
    return (
        <PersistentMapPage
            apiUrl={`${import.meta.env.VITE_API_URL || 'https://giveit-backend.onrender.com'}/api/rentals`}
            title={t("Explore offers")}
        />
    );
};

export default RentalsMapPage;