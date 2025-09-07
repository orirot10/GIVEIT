import React from "react";
import { CiSearch } from "react-icons/ci";
import { IoClose } from "react-icons/io5";
import { useTranslation } from 'react-i18next';

const SearchBar = ({ searchQuery, setSearchQuery, onSearch, onClose, onClear }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'he';

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && typeof onSearch === 'function') {
      onSearch();
    }
  };

  const handleClear = () => {
    if (typeof onClear === 'function') {
      onClear();
    }
  };

  return (
    <div className="flex justify-center" style={{ padding: '8px 0' }}>
      <div className="relative w-[100%] max-w-md mx-auto" dir={isRTL ? 'rtl' : 'ltr'}>
        <input
          type="text"
          placeholder={t('Search rentals or services ...')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          className={`w-full py-3 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-base bg-white transition-all duration-200 ${isRTL ? 'text-right pr-12' : 'text-left pl-10'}`}
          style={{
            borderRadius: '25px',
            fontSize: '16px',
            height: '48px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            paddingRight: isRTL ? '48px' : '120px',
            paddingLeft: isRTL ? '120px' : '48px'
          }}
        />
        <div className={`absolute top-1/2 -translate-y-1/2 flex items-center gap-1 ${isRTL ? 'left-2' : 'right-2'}`}>
          <button
            onClick={onSearch}
            aria-label="Search"
            title="Search"
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-1.5 transition-colors"
            style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <CiSearch size={16} />
          </button>
          {searchQuery && (
            <button
              onClick={handleClear}
              aria-label="Clear search"
              title="Clear search"
              className="bg-gray-400 hover:bg-gray-500 text-white rounded-full p-1.5 transition-colors"
              style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <IoClose size={16} />
            </button>
          )}
          <button
            onClick={onClose}
            aria-label="Close search"
            title="Close search"
            className="bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 transition-colors"
            style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <IoClose size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;