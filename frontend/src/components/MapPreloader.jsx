import React, { Suspense } from 'react';
import { useMapContext } from '../context/MapContext';

// Lazy-load MapView so it doesn't impact the initial bundle size
const MapView = React.lazy(() => import('./HomePage/MapView'));

/**
 * Renders a hidden MapView so that Google Maps is initialized in the
 * background. This keeps the map warm and reduces perceived loading
 * times when users navigate to pages that display the map.
 */
const MapPreloader = () => {
  const { locations, contentType } = useMapContext();

  return (
    <div
      style={{
        position: 'fixed',
        width: '1px',
        height: '1px',
        top: 0,
        left: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        opacity: 0,
      }}
      aria-hidden="true"
    >
      <Suspense fallback={null}>
        <MapView
          locations={locations}
          mapHeight="1px"
          contentType={contentType}
        />
      </Suspense>
    </div>
  );
};

export default MapPreloader;
