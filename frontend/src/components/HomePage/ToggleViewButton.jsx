import React from "react";
import { CiMap, CiCircleList } from "react-icons/ci";
import '../../styles/HomePage/ToggleViewButton.css';

const ToggleViewButton = ({ view, setView }) => {
    const toggleView = () => {
        setView(view === "map" ? "list" : "map");
    };

    return (
        <div
            className={`toggle-icon active`}
            onClick={toggleView}
            title={view === "map" ? "Switch to List View" : "Switch to Map View"}
        >
            {view === "map" ? <CiCircleList size={24} /> : <CiMap size={24} />}
        </div>
    );
};

export default ToggleViewButton;
