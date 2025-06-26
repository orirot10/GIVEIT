

import React from 'react';
import { useTranslation } from 'react-i18next';
import '../../styles/HomePage/TabBar.css';

const TabBar = ({ activeTab, onTabChange, tabs }) => {
    const { i18n } = useTranslation();
    const isRTL = i18n.language === 'en';
    const activeIndex = tabs.findIndex(tab => tab.id === activeTab);
    const indicatorTransform = isRTL
        ? `translateX(${(tabs.length - 1 - activeIndex) * 100}%)`
        : `translateX(${activeIndex * 100}%)`;

    return (
        <div className="tab-bar-container">
            <div className="tab-bar">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => {


                                    onTabChange(tab.id); // Hebrew mode: click active tab to switch

                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div 
                className="tab-indicator"
                style={{
                    transform: indicatorTransform
                }}
            />
        </div>
    );
};

export default TabBar;