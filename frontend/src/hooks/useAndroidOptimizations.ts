import { useEffect, useRef } from 'react';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

const useAndroidOptimizations = (mapRef: React.RefObject<google.maps.Map>) => {
  const isAndroid = Capacitor.getPlatform() === 'android';
  const tilesPrewarmed = useRef(false);

  useEffect(() => {
    if (!isAndroid || !mapRef.current) return;

    const map = mapRef.current;

    // Pre-warm tiles after map is ready
    const prewarmTiles = () => {
      if (tilesPrewarmed.current) return;
      
      google.maps.event.addListenerOnce(map, 'idle', () => {
        const center = map.getCenter();
        const zoom = map.getZoom();
        
        if (center && zoom) {
          // Gentle off-screen pan to cache adjacent tiles
          const offset = 0.001;
          const tempCenter = new google.maps.LatLng(
            center.lat() + offset, 
            center.lng() + offset
          );
          
          map.panTo(tempCenter);
          setTimeout(() => map.panTo(center), 100);
          
          tilesPrewarmed.current = true;
          console.log('Android: Tiles prewarmed');
        }
      });
    };

    // App state handling for Android
    const handleAppStateChange = (state: { isActive: boolean }) => {
      if (state.isActive) {
        // App resumed - refresh map without re-init
        setTimeout(() => {
          if (map && window.google?.maps?.event) {
            window.google.maps.event.trigger(map, 'resize');
            console.log('Android: Map refreshed on app resume');
          }
        }, 100);
      }
    };

    // Set up listeners
    prewarmTiles();
    App.addListener('appStateChange', handleAppStateChange);

    return () => {
      App.removeAllListeners();
    };
  }, [mapRef, isAndroid]);

  return { isAndroid };
};

export default useAndroidOptimizations;