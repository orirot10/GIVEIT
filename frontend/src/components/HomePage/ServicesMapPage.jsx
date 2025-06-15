import React from "react";
import GenericMapPage from "./GenericMapPage";

const ServicesMapPage = () => {
return (
    <GenericMapPage
    //apiUrl={`${import.meta.env.VITE_API_URL}/api/services`}
    apiUrl={`${import.meta.env.VITE_API_URL}/api/service_requests`}   
    title="Explore Requests"
    />
);
};

export default ServicesMapPage;