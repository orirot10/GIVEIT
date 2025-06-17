import React from 'react';
import '../../styles/HomePage/TabBar.css';

const TabBar = ({ activeTab, onTabChange, tabs }) => {
    return (
        <div className="tab-bar-container">
            <div className="tab-bar">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => onTabChange(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div 
                className="tab-indicator"
                style={{
                    transform: `translateX(${tabs.findIndex(tab => tab.id === activeTab) * 100}%)`
                }}
            />
        </div>
    );
};

export default TabBar; 