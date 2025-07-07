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
      <div className="relative w-[100%] max-w-md flex items-center gap-1 mx-auto" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="relative flex-1">
          <input
            type="text"
            placeholder={t('rentals.search_placeholder')}
            value={searchQuery}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            className={`w-full px-10 py-3 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-base bg-white transition-all duration-200 ${isRTL ? 'text-right pr-12 pl-5' : 'text-left pl-12 pr-5'}`}
            style={{
              borderRadius: '25px',
              fontSize: '16px',
              height: '48px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
          />
          
          {/* Search icon inside input */}

        </div>

        {isSearched ? (
          <button
            onClick={handleClearSearch}
            className="search-filter-style red"
            style={{
              borderRadius: '20px',
              padding: '8px 16px',
              background: '#f44336',
              color: 'white',
              border: 'none',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              minWidth: '60px',
              height: '36px'
            }}
          >
            {t('common.clear')}
          </button>
        ) : (
          <button
            onClick={handleSearch}
            className="search-filter-style gray flex items-center justify-center"
            style={{
              borderRadius: '50%',
              padding: '12px',
              background: '#087E8B',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              width: '48px',
              height: '48px',
              boxShadow: '0 2px 8px rgba(8, 126, 139, 0.2)'
            }}
            aria-label="Search"
            onMouseOver={e => e.currentTarget.style.background = '#009688'}
            onMouseOut={e => e.currentTarget.style.background = '#087E8B'}
          >
            <CiSearch className="text-xl" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;