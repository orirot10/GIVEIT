import React from 'react';

const LoadingSpinner = ({ message = 'Loading...' }) => (
  <div className="loading-container" role="status" aria-live="polite">
    <div className="loading-spinner" />
    <span className="loading-message">{message}</span>
  </div>
);

export default LoadingSpinner;

