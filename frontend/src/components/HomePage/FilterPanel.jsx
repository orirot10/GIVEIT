import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BiFilterAlt, BiX } from 'react-icons/bi';
import { FiCheck } from 'react-icons/fi';
import { 
  getRentalCategoryFilterTags, 
  getServiceCategoryFilterTags 
} from '../../constants/categories';
import '../../styles/HomePage/FilterPanel.css';

const FilterPanel = ({ isOpen, onClose, onApplyFilters, initialFilters = {} }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'he';

  // Filter states
  const [listingType, setListingType] = useState(initialFilters.listingType || 'offers');
  const [contentType, setContentType] = useState(initialFilters.contentType || 'products');
  const [selectedCategories, setSelectedCategories] = useState(initialFilters.categories || []);

  // Get categories based on content type
  const getAvailableCategories = () => {
    return contentType === 'products' 
      ? getRentalCategoryFilterTags(i18n.language)
      : getServiceCategoryFilterTags(i18n.language);
  };

  const toggleCategory = (categoryValue) => {
    setSelectedCategories(prev => 
      prev.includes(categoryValue)
        ? prev.filter(cat => cat !== categoryValue)
        : [...prev, categoryValue]
    );
  };

  const handleApply = () => {
    onApplyFilters({
      listingType,
      contentType,
      categories: selectedCategories
    });
    onClose();
  };

  const handleClear = () => {
    setListingType('offers');
    setContentType('products');
    setSelectedCategories([]);
  };

  // Close on backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="filter-panel-overlay" onClick={handleBackdropClick}>
      <div className={`filter-panel-sheet ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Header */}
        <div className="filter-panel-header">
          <div className="filter-panel-handle"></div>
          <div className="filter-panel-title-row">
            <BiFilterAlt className="filter-panel-icon" />
            <h2 className="filter-panel-title">{t('common.filter_options')}</h2>
            <button className="filter-panel-close" onClick={onClose}>
              <BiX />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="filter-panel-content">
          {/* Offers/Requests Toggle */}
          <div className="filter-section">
            <h3 className="filter-section-title">{t('common.listing_type')}</h3>
            <div className="toggle-group">
              <button
                className={`toggle-btn ${listingType === 'offers' ? 'active' : ''}`}
                onClick={() => setListingType('offers')}
              >
                {listingType === 'offers' && <FiCheck className="check-icon" />}
                {t('common.offers')}
              </button>
              <button
                className={`toggle-btn ${listingType === 'requests' ? 'active' : ''}`}
                onClick={() => setListingType('requests')}
              >
                {listingType === 'requests' && <FiCheck className="check-icon" />}
                {t('common.requests')}
              </button>
            </div>
          </div>

          {/* Products/Services Toggle */}
          <div className="filter-section">
            <h3 className="filter-section-title">{t('common.content_type')}</h3>
            <div className="toggle-group">
              <button
                className={`toggle-btn ${contentType === 'products' ? 'active' : ''}`}
                onClick={() => setContentType('products')}
              >
                {contentType === 'products' && <FiCheck className="check-icon" />}
                {t('common.products')}
              </button>
              <button
                className={`toggle-btn ${contentType === 'services' ? 'active' : ''}`}
                onClick={() => setContentType('services')}
              >
                {contentType === 'services' && <FiCheck className="check-icon" />}
                {t('common.services')}
              </button>
            </div>
          </div>

          {/* Categories */}
          <div className="filter-section">
            <h3 className="filter-section-title">{t('common.categories')}</h3>
            <div className="categories-grid">
              {getAvailableCategories().map((category) => (
                <button
                  key={category.value}
                  className={`category-chip ${selectedCategories.includes(category.value) ? 'selected' : ''}`}
                  onClick={() => toggleCategory(category.value)}
                >
                  <span className="category-icon">📦</span>
                  <span className="category-label">{category.label}</span>
                  {selectedCategories.includes(category.value) && (
                    <FiCheck className="category-check" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="filter-panel-footer">
          <button className="filter-btn-secondary" onClick={handleClear}>
            {t('common.clear_all')}
          </button>
          <button className="filter-btn-primary" onClick={handleApply}>
            {t('common.apply_filters')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;