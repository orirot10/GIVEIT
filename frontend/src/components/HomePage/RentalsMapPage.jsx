import React from "react";
import GenericMapPage from "./GenericMapPage";
import { useTranslation } from 'react-i18next';

const RentalsMapPage = () => {
    const { t } = useTranslation();  // t is the function to get translated strings
return (
    <GenericMapPage
    apiUrl="http://localhost:5000/api/rentals"
    title={t("Explore Rentals")}
    />
);
};

export default RentalsMapPage;