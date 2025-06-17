import React from "react";
import GenericMapPage from "./GenericMapPage";
import { useTranslation } from 'react-i18next';

const RentalsPage = () => {
    const { t } = useTranslation();
    return (
        <GenericMapPage
            apiUrl={`${import.meta.env.VITE_API_URL}/api/rentals`}
            title={t("Rentals")}
        />
    );
};

export default RentalsPage; 