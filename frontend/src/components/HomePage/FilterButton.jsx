import React, { useState } from "react";
import { VscFilter } from "react-icons/vsc";
import { rentalCategories, serviceCategories } from "../../constants/categories";
import '../../styles/HomePage/FilterButton.css'
import { CiCircleRemove } from "react-icons/ci";
import { BiFilterAlt } from "react-icons/bi";
import { useTranslation } from 'react-i18next';

const FilterButton = ({ onApplyFilters, categoryType }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'he';
  const [showModal, setShowModal] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const availableCategories =
    categoryType === "rental" ? rentalCategories : serviceCategories;

  const toggleCategory = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleApply = () => {
    onApplyFilters({ 
      categories: selectedCategories
    });
    setShowModal(false);
  };

  return (
    <>
      <button className="search-filter-style filter-button-large"
        onClick={() => setShowModal(true)}
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
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className={`category-btn ${
                      selectedCategories.includes(cat) ? "selected" : ""
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="button-group">
              <button 
                className="filter-action-btn" 
                onClick={handleApply}
              >
                {t('common.filter')}
              </button>
              <button
                className="close-btn"
                onClick={() => setShowModal(false)}
              >
                <CiCircleRemove />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FilterButton;
