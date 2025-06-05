import React from 'react';
import { FaHome, FaTools } from 'react-icons/fa';
import '../../styles/HomePage/ContentTypeToggle.css';

const ContentTypeToggle = ({ contentType, setContentType }) => {
    return (
        <div className="content-type-toggle">
            <div className="toggle-container">
                <button
                    onClick={() => setContentType('rentals')}
                    className={`toggle-option ${contentType === 'rentals' ? 'active' : ''}`}
                >
                    <FaHome size={20} />
                    <span>Rentals</span>
                </button>
                <button
                    onClick={() => setContentType('services')}
                    className={`toggle-option ${contentType === 'services' ? 'active' : ''}`}
                >
                    <FaTools size={20} />
                    <span>Services</span>
                </button>
            </div>
            <div className="content-type-indicator">
                {contentType === 'rentals' ? 'Showing Rentals' : 'Showing Services'}
            </div>
        </div>
    );
};

export default ContentTypeToggle; 