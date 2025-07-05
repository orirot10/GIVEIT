

import React from 'react';
import '../../styles/HomePage/TabBar.css';

const TabBar = ({ activeTab, onTabChange, tabs }) => {
    const activeIndex = tabs.findIndex(tab => tab.id !== activeTab);
    const indicatorTransform = `translateX(${activeIndex * 100}%)`;


    return (
        <div className="tab-bar-container">
            <div className="tab-bar">
            {tabs.map((tab) => (
    <button
        key={tab.id}
        className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
        onClick={() => {
            if (tab.id !== activeTab) {
                onTabChange(tab.id);
            }
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