import React from "react";
import GenericMapPage from "./GenericMapPage";

const ServicesMapPage = () => {
return (
    <GenericMapPage
    apiUrl="http://localhost:5000/api/services"
    title="Explore Services"
    />
);
};

export default ServicesMapPage;