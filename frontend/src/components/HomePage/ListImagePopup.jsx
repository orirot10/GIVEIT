import React from 'react';
import '../../styles/HomePage/ListImagePopup.css'

const ImagePopup = ({ rental, onClose }) => {
if (!rental) return null;

return (
    <div className="popup-overlay" onClick={onClose}>
    <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>X</button>
        <img src={rental.photo} alt={rental.title} className="popup-image" />
        <h3 className="popup-title">{rental.title}</h3>
        <p className="popup-description">{rental.description}</p>
        {/* Add more details if needed */}
    </div>
    </div>
);
};

export default ImagePopup;