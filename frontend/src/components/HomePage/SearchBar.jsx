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
<div className="flex justify-center">
<div className="relative w-[98%] max-w-md flex items-center gap-0.5 mx-auto" dir={isRTL ? 'rtl' : 'ltr'}>
    <input
      type="text"
      placeholder={t('rentals.search_placeholder')}
      value={searchQuery}
      onChange={handleInputChange}
      onKeyPress={handleKeyPress}
      className={`w-full pl-10 pr-4 py-3 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary text-base bg-white rounded-full ${isRTL ? 'text-right' : 'text-left'}`}
    />

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
        className="search-filter-style gray rounded-full p-2 flex items-center justify-center"
        aria-label="Search"
      >
        <CiSearch className="text-xl text-gray-700" />
      </button>
    )}
  </div>
</div>
  );
};

export default SearchBar;
