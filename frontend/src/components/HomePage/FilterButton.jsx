import React, { useState } from "react";
import { VscFilter } from "react-icons/vsc";
import { rentalCategories, serviceCategories } from "../../constants/categories";
import '../../styles/HomePage/FilterButton.css'
import { CiCircleRemove } from "react-icons/ci";
import { BiFilterAlt } from "react-icons/bi";

const FilterButton = ({ onApplyFilters, categoryType }) => {
const [showModal, setShowModal] = useState(false);
const [selectedCategories, setSelectedCategories] = useState([]);
const [price, setPrice] = useState(0);

const availableCategories =
    categoryType === "rental" ? rentalCategories : serviceCategories;

const toggleCategory = (cat) => {
    setSelectedCategories((prev) =>
    prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
};

const handleApply = () => {
    onApplyFilters({ categories: selectedCategories, maxPrice: price });
    setShowModal(false);
};

return (
    <>
        <button className="search-filter-style"
            // className="toggle-view-btn flex items-center gap-2 px-4 py-2 border rounded bg-gray-100 hover:bg-gray-200"
            onClick={() => setShowModal(true)}
        >
            <BiFilterAlt style={{ fontSize: "20px", color: "black" }} />
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
            <p className="section-title">Max Price: ₪{price}</p>
            <input
                type="range"
                min="0"
                max="1000"
                step="10"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="price-slider"
            />
            </div>

            <div className="button-group">
            <button className="filter-action-btn" onClick={handleApply}>
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
