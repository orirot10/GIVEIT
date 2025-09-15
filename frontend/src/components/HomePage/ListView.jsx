import React, { useState, useMemo } from "react";
// import ImagePopup from "./ListImagePopup.jsx"; // Remove ImagePopup import
import Popup from "../Shared/Popup"; // Import the correct Popup component
import '../../styles/HomePage/ListView.css';
import { usePricePeriodTranslation } from '../../utils/pricePeriodTranslator';
import {
    getRentalCategoryFilterTags,
    getServiceCategoryFilterTags,
    getRentalSubcategoryFilterTags,
    getServiceSubcategoryFilterTags
} from "../../constants/categories";
import { useTranslation } from 'react-i18next';

const ListView = ({ rentals, contentType }) => {
  // Rename state for clarity (optional but good practice)
  const [selectedItem, setSelectedItem] = useState(null);
  const [loadedImages, setLoadedImages] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const { translatePricePeriod } = usePricePeriodTranslation();
  const { i18n } = useTranslation();

  const handleItemClick = (item) => {
    console.log('[ListView] Item passed to handleItemClick:', item); // Add log to check item data
    setSelectedItem(item);
  };

  const handleClosePopup = () => {
    setSelectedItem(null);
  };

  const handleImageLoad = (itemId) => {
    setLoadedImages(prev => ({
      ...prev,
      [itemId]: true
    }));
  };

  // Get available categories and subcategories based on contentType
  const availableCategories = useMemo(() => {
    return contentType.includes('rental')
      ? getRentalCategoryFilterTags(i18n.language)
      : getServiceCategoryFilterTags(i18n.language);
  }, [contentType, i18n.language]);

  const availableSubcategories = useMemo(() => {
    if (!selectedCategory) return [];
    return contentType.includes('rental')
      ? getRentalSubcategoryFilterTags(selectedCategory, i18n.language)
      : getServiceSubcategoryFilterTags(selectedCategory, i18n.language);
  }, [selectedCategory, contentType, i18n.language]);

  // Category and subcategory click handlers
  const handleCategoryLabelClick = (cat) => {
    if (selectedCategory === cat) {
      setSelectedCategory('');
      setSelectedSubcategory('');
    } else {
      setSelectedCategory(cat);
      setSelectedSubcategory('');
    }
  };

  const handleSubcategoryLabelClick = (sub) => {
    setSelectedSubcategory(selectedSubcategory === sub ? '' : sub);
  };

  // Filter rentals based on selected category and subcategory
  const filteredRentals = useMemo(() => {
    let filtered = rentals;
    
    if (selectedCategory) {
      filtered = filtered.filter(rental => rental.category === selectedCategory);
    }
    
    if (selectedSubcategory) {
      filtered = filtered.filter(rental => rental.subcategory === selectedSubcategory);
    }
    
    return filtered;
  }, [rentals, selectedCategory, selectedSubcategory]);

  return (
    <div className="list-container-wrapper">
      {/* Tags filtering */}
      <style>{`
        .floating-category-labels {
          display: flex;
          flex-wrap: nowrap;
          overflow-x: auto;
          justify-content: flex-start;
          gap: 8px;
          margin: 8px 0;
          padding: 0 8px 2px 4px;
          scrollbar-width: none;
          -ms-overflow-style: none;
          background: transparent;
        }
        .floating-category-labels::-webkit-scrollbar {
          display: none;
        }
        .category-label {
          background: #fff;
          border: 1px solid #cbd5e1;
          color: #334155;
          border-radius: 16px;
          padding: 4px 16px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }
        .category-label.selected, .category-label:hover {
          background: #14b8a6;
          color: #fff;
          border-color: #14b8a6;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
        }
      `}</style>
      
      <div className="floating-category-labels">
        {availableCategories.map((cat) => (
          <span
            key={cat.value}
            className={`category-label${selectedCategory === cat.value ? ' selected' : ''}`}
            onClick={() => handleCategoryLabelClick(cat.value)}
          >
            {cat.label}
          </span>
        ))}
      </div>
      
      {selectedCategory && (
        <div className="floating-category-labels">
          {availableSubcategories.map((sub) => (
            <span
              key={sub.value}
              className={`category-label${selectedSubcategory === sub.value ? ' selected' : ''}`}
              onClick={() => handleSubcategoryLabelClick(sub.value)}
            >
              {sub.label}
            </span>
          ))}
        </div>
      )}
      
      <div className="list-container">
        {filteredRentals.map((rental) => (
          <div
            key={rental._id} // Assuming rentals have _id
            className="rental-card"
            onClick={() => handleItemClick(rental)} // Use new handler
          >
            <div className="rental-image-container">
              {rental.images && rental.images[0] ? (
                (() => {
                  const firstImage = rental.images[0];
                  const imageSrc = firstImage.startsWith('http')
                    ? firstImage
                    : `${import.meta.env.VITE_API_URL || 'https://giveit-backend.onrender.com'}${firstImage}`;
                  return (
                    <img
                      src={imageSrc}
                      alt={rental.title}
                      className={`rental-image ${loadedImages[rental._id] ? 'loaded' : 'loading'}`}
                      onLoad={() => handleImageLoad(rental._id)}
                    />
                  );
                })()
              ) : (
                <div className="rental-image skeleton" />
              )}
            </div>
            <div className="rental-card-content">
              <h3 className="rental-title">{rental.title}</h3>
              <p className="rental-description">{rental.description}</p>
              <p className="rental-info">Category: {rental.category}</p>
              <p className="rental-info">Price: {rental.price} {translatePricePeriod(rental.pricePeriod)}</p>
              <p className="rental-info">Location: {rental.city}</p>
              <p className="rental-info">Rating: {rental.rating ? rental.rating.toFixed(1) : 'N/A'}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Use the Popup component */}
      {selectedItem && (
        <Popup item={selectedItem} onClose={handleClosePopup} contentType={contentType} />
      )}
    </div>
  );
};

export default ListView;