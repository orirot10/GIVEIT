import React, { useEffect, useState, useRef, Suspense } from 'react';
import { useMapContext } from '../context/MapContext';
import { useLocation } from 'react-router-dom';

const MapView = React.lazy(() => import('./HomePage/MapView'));

const PersistentMap = () => {
  const { mapRef, locations, contentType, setMapBounds } = useMapContext();
  const location = useLocation();
  const [isMapVisible, setIsMapVisible] = useState(false);

  // Map is visible on main pages (services, rentals, home)
  useEffect(() => {
    const mapPages = ['/', '/services', '/rentals'];
    setIsMapVisible(mapPages.includes(location.pathname));
  }, [location.pathname]);

  const handleBoundsChanged = (bounds) => {
    setMapBounds(bounds);
  };

  if (!isMapVisible) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 1,
        pointerEvents: 'none'
      }}
    >
      <Suspense fallback={null}>
        <MapView
          locations={locations}
          mapHeight="100vh"
          onBoundsChanged={handleBoundsChanged}
          contentType={contentType}
          isPersistent={true}
        />
      </Suspense>
    </div>
  );
};

export default PersistentMap;