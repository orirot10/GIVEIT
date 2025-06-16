import React from "react";
import GenericMapPage from "./GenericMapPage";

const ServicesMapPage = () => {
    return (
        <GenericMapPage
            apiUrl={`${import.meta.env.VITE_API_URL}/api/services`}
            title="Explore Services"
        />
    );
};

export default ServicesMapPage;