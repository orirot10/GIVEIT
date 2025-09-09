import React from 'react';
import { useLocation } from 'react-router-dom';

const PageOverlay = ({ children }) => {
  const location = useLocation();
  
  // Map pages don't need background overlay
  const mapPages = ['/', '/services', '/rentals'];
  const isMapPage = mapPages.includes(location.pathname);
  
  if (isMapPage) {
    return children;
  }
  
  // Non-map pages get a white background overlay
  return (
    <div style={{
      position: 'relative',
      zIndex: 10,
      background: 'white',
      minHeight: '100vh'
    }}>
      {children}
    </div>
  );
};

export default PageOverlay;