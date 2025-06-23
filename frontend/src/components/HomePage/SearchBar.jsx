import React, { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { useTranslation } from 'react-i18next';

const SearchBar = ({ searchQuery, setSearchQuery, onSearch, onClearFilters }) => {
  const [isSearched, setIsSearched] = useState(false);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'he';

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
      onSearch();
    }
    if (typeof onClearFilters === 'function') {
      onClearFilters();
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
    <div className="w-full max-w-md flex items-center space-x-2" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="relative flex-grow">
        <CiSearch
          style={{
            position: "absolute",
            [isRTL ? 'right' : 'left']: "8px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "gray",
            fontSize: "18px",
            pointerEvents: "none",
          }}
        />
        <input
          type="text"
          placeholder={t('rentals.search_placeholder')}
          value={searchQuery}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          className={`search-bar-input ${isRTL ? 'pr-8 pl-4' : 'pl-8 pr-4'}`}
        />
      </div>
      {isSearched ? (
        <button
          onClick={handleClearSearch}
          className="search-filter-style red"
        >
          {t('common.clear')}
        </button>
      ) : (
        <button
          onClick={handleSearch}
          className="search-filter-style gray"
        >
          {t('common.search')}
        </button>
      )}
    </div>
  );
};

export default SearchBar;