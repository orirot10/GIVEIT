import React, { useState } from "react";
import { CiSearch } from "react-icons/ci";

const SearchBar = ({ searchQuery, setSearchQuery, onSearch, onClearFilters }) => {
  const [isSearched, setIsSearched] = useState(false);

  const handleSearch = () => {
    if (typeof onSearch === 'function') {
      onSearch();
    }
    if (searchQuery.trim() !== "") {
      setIsSearched(true);
    } else {
      setIsSearched(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setIsSearched(false);
    if (typeof onSearch === 'function') {
      onSearch(); // Call onSearch to handle empty query
    }
    if (typeof onClearFilters === 'function') {
      onClearFilters(); // Call onClearFilters to reset filters and fetch all items
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value.trim() === "") {
      setIsSearched(false);
    }
  };

  return (
    <div className="w-full max-w-md flex items-center space-x-2">
      <div className="relative flex-grow">
        <CiSearch
          style={{
            position: "absolute",
            left: "8px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "gray",
            fontSize: "18px",
            pointerEvents: "none",
          }}
        />
        <input
          type="text"
          placeholder="      what do you need?"
          value={searchQuery}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          className="w-full pl-8 pr-4 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>
      {isSearched ? (
        <button
          onClick={handleClearSearch}
          className="search-filter-style red"
        >
          Clear
        </button>
      ) : (
        <button
          onClick={handleSearch}
          className="search-filter-style gray"
        >
          Search
        </button>
      )}
    </div>
  );
};

export default SearchBar;