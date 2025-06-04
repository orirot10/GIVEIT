import React, { useState } from "react";
// import ImagePopup from "./ListImagePopup.jsx"; // Remove ImagePopup import
import Popup from "../Shared/Popup"; // Import the correct Popup component
import '../../styles/HomePage/ListView.css';

const ListView = ({ rentals }) => {
  // Rename state for clarity (optional but good practice)
  const [selectedItem, setSelectedItem] = useState(null);
  const [loadedImages, setLoadedImages] = useState({});

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

  return (
    <div className="list-container-wrapper">
      <div className="list-container">
        {rentals.map((rental) => (
          <div
            key={rental._id} // Assuming rentals have _id
            className="rental-card"
            onClick={() => handleItemClick(rental)} // Use new handler
          >
            <div className="rental-image-container">
              {rental.images && rental.images[0] ? (
                <img
                  src={`${import.meta.env.VITE_API_URL}${rental.images[0]}`} // Use the first image from the array, prepended with backend URL
                  alt={rental.title}
                  className={`rental-image ${loadedImages[rental._id] ? 'loaded' : 'loading'}`}
                  onLoad={() => handleImageLoad(rental._id)}
                />
              ) : (
                <div className="rental-image skeleton" />
              )}
            </div>
            <h3 className="rental-title"> {rental.title}</h3>
            <p className="rental-description">📝 {rental.description}</p>
            <p className="rental-info">
                🏷️  {rental.category}
            </p>
            <p className="rental-info">
                💸  {rental.price}₪
            </p>
            {/* Removed status as it might not be in Popup */}
            {/* Removed contact details as Popup handles its own */}
          </div>
        ))}
      </div>

      {/* Use the Popup component */}
      {selectedItem && (
        <Popup item={selectedItem} onClose={handleClosePopup} />
      )}
    </div>
  );
};

export default ListView;