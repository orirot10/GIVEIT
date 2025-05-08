import React, { useState } from "react";
// import ImagePopup from "./ListImagePopup.jsx"; // Remove ImagePopup import
import Popup from "../Shared/Popup"; // Import the correct Popup component
import '../../styles/HomePage/ListView.css';

const ListView = ({ rentals }) => {
  // Rename state for clarity (optional but good practice)
  const [selectedItem, setSelectedItem] = useState(null);

  const handleItemClick = (item) => {
    console.log('[ListView] Item passed to handleItemClick:', item); // Add log to check item data
    setSelectedItem(item);
  };

  const handleClosePopup = () => {
    setSelectedItem(null);
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
            {rental.images && rental.images[0] && ( // Check for images array and first image
              <img
                src={`http://localhost:5000${rental.images[0]}`} // Use the first image from the array, prepended with backend URL
                alt={rental.title}
                className="rental-image"
              />
            )}
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