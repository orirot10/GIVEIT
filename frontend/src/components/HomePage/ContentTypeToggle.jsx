import React from 'react';
import '../../styles/HomePage/ContentTypeToggle.css';

const ContentTypeToggle = ({ contentType, setContentType }) => {
    const handleToggle = (type) => {
        setContentType(type);
    };

    return (
        <div className="content-type-toggle">
            <button
                className={`toggle-btn ${contentType === 'rentals' ? 'active' : ''}`}
                onClick={() => handleToggle('rentals')}
            >
                Available Products
            </button>
            <button
                className={`toggle-btn ${contentType === 'services' ? 'active' : ''}`}
                onClick={() => handleToggle('services')}
            >
                Available Services
            </button>
            <button
                className={`toggle-btn ${contentType === 'rental_requests' ? 'active' : ''}`}
                onClick={() => handleToggle('rental_requests')}
            >
                Wanted Products
            </button>
            <button
                className={`toggle-btn ${contentType === 'service_requests' ? 'active' : ''}`}
                onClick={() => handleToggle('service_requests')}
            >
                Wanted Services
            </button>
        </div>
    );
};

export default ContentTypeToggle; 