import React from 'react';
import { useTranslation } from 'react-i18next';
import '../../styles/HomePage/ContentTypeToggle.css';

const ContentTypeToggle = ({ contentType, setContentType }) => {
    const { t } = useTranslation();

    const buttons = [
        { id: 'rentals', label: t('my_items.available_products'), style: 'default' },
        { id: 'services', label: t('my_items.available_services'), style: 'default' },
        { id: 'rental_requests', label: t('my_items.wanted_products'), style: 'default' },
        { id: 'service_requests', label: t('my_items.wanted_services'), style: 'default' },
        { id: 'all', label: t('my_items.all'), style: 'highlight' },
    ];

    const handleClick = (id) => {
        // Only update contentType if the clicked button is not already active
        if (contentType !== id) {
            setContentType(id);
        }
    };

    return (
        <div className="content-type-toggle flex gap-2">
            {buttons.map((btn) => (
                <button
                    key={btn.id}
                    className={`toggle-btn px-4 py-2 rounded-full font-medium transition-colors duration-200 ${
                        btn.style === 'highlight'
                            ? contentType === btn.id
                                ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                                : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                            : (btn.id === 'rental_requests' || btn.id === 'service_requests')
                            ? contentType === btn.id
                                ? 'bg-purple-500 text-white hover:bg-purple-600'
                                : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                            : contentType === btn.id
                            ? 'bg-green-500 text-white hover:bg-green-600'
                            : 'bg-green-100 text-green-800 hover:bg-green-200'
                    }`}
                    onClick={() => handleClick(btn.id)}
                >
                    {btn.label}
                </button>
            ))}
        </div>
    );
};

export default ContentTypeToggle;