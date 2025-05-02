// import React from "react";
// import { CiMap, CiCircleList } from "react-icons/ci";

// const ToggleViewButton = ({ view, setView }) => {
// return (
//     <button
//     onClick={() => setView(view === "map" ? "list" : "map")}
//     className="toggle-view-btn flex items-center gap-2 px-4 py-2 border rounded bg-gray-100 hover:bg-gray-200"
//     >
//     {view === "map" ? (
//         <CiCircleList style={{ fontSize: "24px", color: "gray" }} />
//     ) : (
//         <CiMap style={{ fontSize: "24px", color: "gray" }} />
//     )}
//     <span>{view === "map" ? "List View" : "Map View"}</span>
//     </button>
// );
// };

// export default ToggleViewButton;

import React from "react";
import { CiMap, CiCircleList } from "react-icons/ci";
import '../../styles/HomePage/ToggleViewButton.css'

const ToggleViewButton = ({ view, setView }) => {
    return (
    <div className="toggle-view-container">
        <button
        onClick={() => setView("list")}
        className={`toggle-icon ${view === "list" ? "active" : ""}`}
        >
        <CiCircleList size={32} />
        </button>
        <button
        onClick={() => setView("map")}
        className={`toggle-icon ${view === "map" ? "active" : ""}`}
        >
        <CiMap size={32} />
        </button>
    </div>
    );
};

export default ToggleViewButton;