import React, { useState } from "react";
import Popup from "../Shared/Popup";
import { FaStar, FaMapMarkerAlt } from "react-icons/fa";
import { UserIcon } from "@heroicons/react/24/solid";
import "../../styles/HomePage/ListView.css";
import { usePricePeriodTranslation } from "../../utils/pricePeriodTranslator";

const ListView = ({ rentals = [], contentType }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [loadedImages, setLoadedImages] = useState({});
  const { translatePricePeriod } = usePricePeriodTranslation();

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const handleClosePopup = () => setSelectedItem(null);

  const handleImageLoad = (itemId) =>
    setLoadedImages((prev) => ({ ...prev, [itemId]: true }));

  return (
    <div className="list-container-wrapper">
      <div className="list-container">
        {(rentals || []).map((rental) => {
          const firstImage = rental.images && rental.images[0];
          const imageSrc = firstImage
            ? firstImage.startsWith("http")
              ? firstImage
              : `${import.meta.env.VITE_API_URL || "https://giveit-backend.onrender.com"}${firstImage}`
            : null;

          const isRequest =
            contentType?.includes("request") || rental.type?.includes("request");
          const categoryLabel = isRequest ? "בקשה" : "הצעה";
          const ownerName =
            [rental.firstName, rental.lastName].filter(Boolean).join(" ") || "N/A";
          const rating = rental.rating || 0;
          const ratingCount = rental.ratingCount || 0;

          return (
            <div
              key={rental._id}
              className="rental-card"
              onClick={() => handleItemClick(rental)}
            >
              {/* Image LEFT */}
              <div className="rental-thumbnail">
                {imageSrc ? (
                  <img
                    src={imageSrc}
                    alt={rental.title}
                    className={`thumbnail-image ${
                      loadedImages[rental._id] ? "loaded" : "loading"
                    }`}
                    onLoad={() => handleImageLoad(rental._id)}
                  />
                ) : (
                  <div className="thumbnail-placeholder">
                    <UserIcon className="placeholder-icon" />
                  </div>
                )}
              </div>

              {/* Content RIGHT */}
              <div className="card-content">
                {/* Header Row */}
                <div className="card-header">
                  <h3 className="card-title">{rental.title}</h3>
                  <span
                    className={`category-tag ${isRequest ? "request" : "offer"}`}
                  >
                    {categoryLabel}
                  </span>
                </div>

                {/* Price */}
                {rental.price && (
                  <div className="card-price">
                    ₪{rental.price}{" "}
                    <span className="price-period">
                      {translatePricePeriod(rental.pricePeriod)}
                    </span>
                  </div>
                )}

                {/* Rating */}
                <div className="card-rating">
                  <div className="rating-stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        className={`star ${
                          star <= Math.round(rating) ? "filled" : "empty"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="rating-text">
                    {rating > 0 ? `${rating.toFixed(1)} (${ratingCount})` : "No reviews"}
                  </span>
                </div>

                {/* Owner + Location */}
                <div className="card-meta">
                  <div className="owner-info">
                    <UserIcon className="meta-icon" />
                    <span className="owner-name">{ownerName}</span>
                  </div>
                  {rental.city && (
                    <div className="location-info">
                      <FaMapMarkerAlt className="meta-icon" />
                      <span className="location-text">{rental.city}</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                {rental.description && (
                  <div className="card-description">
                    <p className="description-text">{rental.description}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {selectedItem && (
        <Popup item={selectedItem} onClose={handleClosePopup} contentType={contentType} />
      )}
    </div>
  );
};

export default ListView;
