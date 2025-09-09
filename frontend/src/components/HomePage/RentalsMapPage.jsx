import React from "react";
import GenericMapPage from "./GenericMapPage";
import { useTranslation } from 'react-i18next';

const RentalsMapPage = () => {
    const { t } = useTranslation();  // t is the function to get translated strings
return (
    <GenericMapPage
    apiUrl={`${import.meta.env.VITE_API_URL || 'https://giveit-backend.onrender.com'}/api/rentals`}
    title={t("Explore offers")}
    />
);
};

export default RentalsMapPage;