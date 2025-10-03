import { useEffect, useRef } from 'react';
import { Capacitor } from '@capacitor/core';

const useAndroidMapOptimization = (mapRef) => {
  const isAndroid = Capacitor.getPlatform() === 'android';
  const optimizationApplied = useRef(false);

  useEffect(() => {
    if (!isAndroid || !mapRef.current || optimizationApplied.current) return;

    const map = mapRef.current;
    
    // Android WebView optimizations
    const optimizeForAndroid = () => {
      try {
        // Force hardware acceleration
        if (window.google?.maps?.event) {
          window.google.maps.event.addListenerOnce(map, 'tilesloaded', () => {
            // Trigger map refresh after tiles load
            setTimeout(() => {
              window.google.maps.event.trigger(map, 'resize');
            }, 100);
          });
        }

        // Optimize WebView rendering
        const mapDiv = map.getDiv();
        if (mapDiv) {
          mapDiv.style.transform = 'translateZ(0)'; // Force GPU acceleration
          mapDiv.style.backfaceVisibility = 'hidden';
          mapDiv.style.perspective = '1000px';
        }

        optimizationApplied.current = true;
      } catch (error) {
        console.warn('Android map optimization failed:', error);
      }
    };

    // Apply optimizations after a short delay
    setTimeout(optimizeForAndroid, 200);

    // Handle app resume/pause for Android
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && map) {
        setTimeout(() => {
          window.google.maps.event.trigger(map, 'resize');
        }, 100);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [mapRef, isAndroid]);

  return { isAndroid };
};

export default useAndroidMapOptimization;