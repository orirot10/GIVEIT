import React, { useState, useEffect } from "react";
import { VscFilter } from "react-icons/vsc";
import { rentalCategories, serviceCategories } from "../../constants/categories";
import '../../styles/HomePage/FilterButton.css'
import { CiCircleRemove } from "react-icons/ci";
import { BiFilterAlt } from "react-icons/bi";

const FilterButton = ({ onApplyFilters, categoryType }) => {
const [showModal, setShowModal] = useState(false);
const [selectedCategories, setSelectedCategories] = useState([]);
const [minPrice, setMinPrice] = useState(0);
const [maxPrice, setMaxPrice] = useState(3000);
const [applyPriceFilter, setApplyPriceFilter] = useState(false);
const [priceError, setPriceError] = useState("");

const availableCategories =
    categoryType === "rental" ? rentalCategories : serviceCategories;

useEffect(() => {
    if (maxPrice < minPrice) {
        setPriceError("Maximum price cannot be less than minimum price");
    } else {
        setPriceError("");
    }
}, [minPrice, maxPrice]);

const toggleCategory = (cat) => {
    setSelectedCategories((prev) =>
    prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
};

const handleMinPriceChange = (e) => {
    const newMinPrice = Number(e.target.value);
    setMinPrice(newMinPrice);
    if (newMinPrice > maxPrice) {
        setMaxPrice(newMinPrice);
    }
};

const handleMaxPriceChange = (e) => {
    const newMaxPrice = Number(e.target.value);
    if (newMaxPrice >= minPrice) {
        setMaxPrice(newMaxPrice);
    }
};

const handleApply = () => {
    if (applyPriceFilter && maxPrice < minPrice) {
        setPriceError("Please fix the price range before applying filters");
        return;
    }

    onApplyFilters({ 
        categories: selectedCategories, 
        maxPrice: applyPriceFilter ? maxPrice : null
    });
    setShowModal(false);
};

return (
    <>
        <button className="search-filter-style filter-button-large"
            onClick={() => setShowModal(true)}
        >
            <BiFilterAlt style={{ fontSize: "24px", color: "black" }} />
            <span>Filter</span>
        </button>

    {showModal && (
        <div className="modal-overlay">
        <div className="modal-content">
            <h2 className="modal-title">Filter Options</h2>

            <div className="section">
            <p className="section-title">Categories:</p>
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

            <div className="section">
            <div className="price-filter-header">
                <p className="section-title">Price Range:</p>
                <label className="price-filter-toggle">
                    <input
                        type="checkbox"
                        checked={applyPriceFilter}
                        onChange={(e) => setApplyPriceFilter(e.target.checked)}
                    />
                    Apply Price Filter
                </label>
            </div>
            {applyPriceFilter && (
                <>
                    <div className="price-range">
                        <p>Min Price: ₪{minPrice}</p>
                        <input
                            type="range"
                            min="0"
                            max="3000"
                            step="10"
                            value={minPrice}
                            onChange={handleMinPriceChange}
                            className="price-slider"
                        />
                    </div>
                    <div className="price-range">
                        <p>Max Price: ₪{maxPrice}</p>
                        <input
                            type="range"
                            min={minPrice}
                            max="3000"
                            step="10"
                            value={maxPrice}
                            onChange={handleMaxPriceChange}
                            className="price-slider"
                        />
                    </div>
                    {priceError && <p className="price-error">{priceError}</p>}
                </>
            )}
            </div>

            <div className="button-group">
            <button 
                className="filter-action-btn" 
                onClick={handleApply}
                disabled={applyPriceFilter && maxPrice < minPrice}
            >
                Filter
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
