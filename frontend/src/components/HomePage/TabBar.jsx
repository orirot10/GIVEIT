

import React from 'react';
import '../../styles/HomePage/TabBar.css';

const TabBar = ({ activeTab, onTabChange, tabs }) => {
    const activeIndex = tabs.findIndex(tab => tab.id === activeTab);
    const indicatorTransform = `translateX(${activeIndex * 100}%)`;
    const isWantedTab = activeTab.includes('request');

    return (
        <div className="tab-bar-container">
            <div className="tab-bar">
            {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        className={`tab-button ${isActive ? 'active' : ''}`}
                        onClick={() => {
                            if (!isActive) {
                                onTabChange(tab.id);
                            }
                        }}
                    >
                        {tab.label}
                    </button>
                );
            })}
            </div>
            <div
                className={`tab-indicator ${isWantedTab ? 'wanted' : 'available'}`}
                style={{
                    transform: indicatorTransform
                }}
            />
        </div>
    );
};

export default TabBar;
