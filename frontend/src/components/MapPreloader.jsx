import { useEffect } from 'react';

/**
 * Preloads the MapView component in the background so it's ready
 * when the user navigates to a map-based page. This helps reduce
 * delays on initial map load without affecting the UI.
 */
const MapPreloader = () => {
  useEffect(() => {
    // Trigger background loading of the MapView module
    import('./HomePage/MapView');
  }, []);

  return null;
};

export default MapPreloader;
