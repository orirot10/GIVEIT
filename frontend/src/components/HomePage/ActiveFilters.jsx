import React from 'react';
import { useTranslation } from 'react-i18next';
import { BiX } from 'react-icons/bi';
import { 
  getRentalCategoryFilterTags, 
  getServiceCategoryFilterTags 
} from '../../constants/categories';
import '../../styles/HomePage/ActiveFilters.css';

const ActiveFilters = ({ filters, onRemoveFilter, onClearAll }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'he';

  // Get category label by value
  const getCategoryLabel = (categoryValue, contentType) => {
    const categories = contentType === 'products' 
      ? getRentalCategoryFilterTags(i18n.language)
      : getServiceCategoryFilterTags(i18n.language);
    
    const category = categories.find(cat => cat.value === categoryValue);
    return category ? category.label : categoryValue;
  };

  // Create filter tags array
  const filterTags = [];

  // Add listing type filter
  if (filters.listingType && filters.listingType !== 'offers') {
    filterTags.push({
      type: 'listingType',
      value: filters.listingType,
      label: t(`common.${filters.listingType}`)
    });
  }

  // Add content type filter
  if (filters.contentType && filters.contentType !== 'products') {
    filterTags.push({
      type: 'contentType',
      value: filters.contentType,
      label: t(`common.${filters.contentType}`)
    });
  }

  // Add category filters
  if (filters.categories && filters.categories.length > 0) {
    filters.categories.forEach(categoryValue => {
      filterTags.push({
        type: 'category',
        value: categoryValue,
        label: getCategoryLabel(categoryValue, filters.contentType || 'products')
      });
    });
  }

  // Don't render if no active filters
  if (filterTags.length === 0) {
    return null;
  }

  return (
    <div className={`active-filters ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="active-filters-content">
        <div className="filter-tags">
          {filterTags.map((tag, index) => (
            <div key={`${tag.type}-${tag.value}-${index}`} className="filter-tag">
              <span className="filter-tag-label">{tag.label}</span>
              <button
                className="filter-tag-remove"
                onClick={() => onRemoveFilter(tag.type, tag.value)}
                aria-label={t('common.remove_filter')}
              >
                <BiX />
              </button>
            </div>
          ))}
        </div>
        
        {filterTags.length > 1 && (
          <button className="clear-all-btn" onClick={onClearAll}>
            {t('common.clear_all')}
          </button>
        )}
      </div>
    </div>
  );
};

export default ActiveFilters;