import React, { useRef, useMemo, useCallback } from 'react';
import { GoogleMap } from '@react-google-maps/api';
import LayerManager from './LayerManager';

// CRITICAL: Preserve exact container style - never modify
const containerStyle = { width: "100%", height: "100%" };
const defaultCenter = { lat: 32.0508, lng: 34.7658 };

// Viewport preservation utility
const useViewportPreservation = (mapRef: React.RefObject<google.maps.Map>) => {
  return useCallback(() => {
    if (!mapRef.current) return null;
    return {
      center: mapRef.current.getCenter()?.toJSON(),
      zoom: mapRef.current.getZoom()
    };
  }, [mapRef]);
};

interface MapShellProps {
  tabType: string;
  data: any[];
  isFetching: boolean;
  onMarkerClick: (item: any) => void;
}

const MapShell: React.FC<MapShellProps> = ({ tabType, data, isFetching, onMarkerClick }) => {
  // Persistent map instance - NEVER recreated
  const mapRef = useRef<google.maps.Map | null>(null);
  const preserveViewport = useViewportPreservation(mapRef);
  
  // Memoized options prevent re-initialization
  const mapOptions = useMemo(() => ({
    disableDefaultUI: true,
    zoomControl: true,
    gestureHandling: "greedy",
    styles: [
      { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
      { featureType: "transit", elementType: "labels", stylers: [{ visibility: "off" }] }
    ]
  }), []);

  const handleMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    console.log('MapShell: Map initialized once - will never remount');
    
    // Android WebView optimizations
    if (window.Capacitor?.getPlatform() === 'android') {
      const mapDiv = map.getDiv();
      mapDiv.style.transform = 'translateZ(0)'; // Force GPU acceleration
      mapDiv.style.backfaceVisibility = 'hidden';
    }
  }, []);

  return (
    <>
      {/* Loading overlay - absolute positioned, no layout impact */}
      {isFetching && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(255,255,255,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          pointerEvents: 'none'
        }}>
          <div style={{
            padding: '8px 16px',
            background: 'white',
            borderRadius: '6px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            fontSize: '14px'
          }}>
            Loading...
          </div>
        </div>
      )}
      
      {/* Map container - NEVER modify these styles */}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={defaultCenter}
        zoom={13}
        options={mapOptions}
        onLoad={handleMapLoad}
      >
        {/* Only layers update - map instance stays persistent */}
        <LayerManager 
          tabType={tabType}
          data={data}
          onMarkerClick={onMarkerClick}
          preserveViewport={preserveViewport}
        />
      </GoogleMap>
    </>
  );
};

export default MapShell;