import React, { useState } from "react";
import {
  getRentalCategoryFilterTags,
  getServiceCategoryFilterTags,
} from "../../constants/categories";
import '../../styles/HomePage/FilterButton.css'
import { CiCircleRemove } from "react-icons/ci";
import { BiFilterAlt } from "react-icons/bi";
import { useTranslation } from 'react-i18next';

const FilterButton = ({ 
  availableCategories,
  selectedCategory,
  onCategoryChange,
  onApplyFilters,
  onClearFilters
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'he';
  const [showModal, setShowModal] = useState(false);

  const handleCategoryClick = (categoryValue) => {
    onCategoryChange(categoryValue);
  };

  const handleApply = () => {
    setShowModal(false);
  };

  const handleClear = () => {
    onCategoryChange(''); // Reset category selection
    onClearFilters();
    setShowModal(false);
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="filter-button"
        style={{
          background: 'transparent',
          color: '#000000',
          border: 'none',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onMouseOver={e => e.currentTarget.style.color = '#333333'}
        onMouseOut={e => e.currentTarget.style.color = '#000000'}
        aria-label="Filter"
      >
        <BiFilterAlt style={{ fontSize: "20px" }} />
      </button>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content" dir={isRTL ? 'rtl' : 'ltr'}>
            <h2 className="modal-title">{t('common.filter_options')}</h2>

            <div className="section">
              <p className="section-title">{t('common.categories')}:</p>
              <div className="categories-container">
                {availableCategories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => handleCategoryClick(cat.value)}
                    className={`category-btn ${
                      selectedCategory === cat.value ? "selected" : ""
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              className="close-btn"
              onClick={() => setShowModal(false)}
            >
              <CiCircleRemove />
            </button>
            
            <div className="button-group">
              <button 
                className="filter-action-btn" 
                onClick={handleApply}
              >
                {t('common.filter')}
              </button>
              <button 
                className="filter-action-btn" 
                onClick={handleClear}
              >
                {t('common.clear')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FilterButton;
