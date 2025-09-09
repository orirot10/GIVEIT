import React, { useState } from "react";
// import ImagePopup from "./ListImagePopup.jsx"; // Remove ImagePopup import
import Popup from "../Shared/Popup"; // Import the correct Popup component
import '../../styles/HomePage/ListView.css';
import { usePricePeriodTranslation } from '../../utils/pricePeriodTranslator';

const ListView = ({ rentals, contentType }) => {
  // Rename state for clarity (optional but good practice)
  const [selectedItem, setSelectedItem] = useState(null);
  const [loadedImages, setLoadedImages] = useState({});
  const { translatePricePeriod } = usePricePeriodTranslation();

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