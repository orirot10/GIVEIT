

import React from 'react';
import '../../styles/HomePage/TabBar.css';

const TabBar = ({ activeTab, onTabChange, tabs }) => {
    const activeIndex = tabs.findIndex(tab => tab.id === activeTab);
    const isWanted = activeTab.includes('request');
    const indicatorColor = isWanted ? 'var(--listing-wanted)' : 'var(--listing-available)';
    const indicatorTransform = `translateX(${activeIndex * 100}%)`;


    return (
        <div className="tab-bar-container">
            <div className="tab-bar">
            {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                const isTabWanted = tab.id.includes('request');
                const activeColor = isTabWanted ? 'var(--listing-wanted)' : 'var(--listing-available)';
                return (
                    <button
                        key={tab.id}
                        className={`tab-button ${isActive ? 'active' : ''}`}
                        onClick={() => {
                            if (!isActive) {
                                onTabChange(tab.id);
                            }
                        }}
                        style={isActive ? { color: activeColor } : undefined}
                    >
                        {tab.label}
                    </button>
                );
            })}
            </div>
            <div
                className="tab-indicator"
                style={{
                    transform: indicatorTransform,
                    backgroundColor: indicatorColor
                }}
            />
        </div>
    );
};

export default TabBar;
