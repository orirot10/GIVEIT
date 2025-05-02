import React from "react";
import { CiSearch } from "react-icons/ci";

const SearchBar = ({ searchQuery, setSearchQuery, onSearch }) => {
const handleKeyPress = (e) => {
    if (e.key === "Enter") onSearch();
};

return (
    <div className="w-full max-w-md relative">
    {/* Icon positioned inside the input */}
    <CiSearch
        style={{
            position: "absolute", 
            left: "10px", 
            top: "-60%", 
            transform: "translateY(200%)",
            color: "black",
            fontSize: "20px",
            pointerEvents: "none",
        }}
        />

    {/* The actual input */}
    <input
        type="text"
        placeholder="       Search rentals or services..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyPress={handleKeyPress}
        // className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    </div>
);
};

export default SearchBar;