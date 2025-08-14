import React from "react";
import { CiSearch } from "react-icons/ci";
import { IoClose } from "react-icons/io5";
import { useTranslation } from 'react-i18next';

const SearchBar = ({ searchQuery, setSearchQuery, onSearch, onClose }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'he';

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && typeof onSearch === 'function') {
      onSearch();
    }
  };

  return (
    <div className="flex justify-center">
      <div className="relative w-[100%] max-w-md mx-auto" dir={isRTL ? 'rtl' : 'ltr'}>
        <CiSearch className={`absolute top-1/2 -translate-y-1/2 text-gray-500 ${isRTL ? 'right-3' : 'left-3'}`} />
        <input
          type="text"
          placeholder={t('rentals.search_placeholder')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          className={`w-full py-3 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-base bg-white transition-all duration-200 ${isRTL ? 'text-right pr-12 pl-10' : 'text-left pl-10 pr-12'}`}
          style={{
            borderRadius: '25px',
            fontSize: '16px',
            height: '48px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        />
        <button
          onClick={onClose}
          aria-label="Close search"
          title="Close search"
          className={`absolute top-1/2 -translate-y-1/2 bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-full p-1 transition-colors ${isRTL ? 'left-3' : 'right-3'}`}
        >
          <IoClose />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;