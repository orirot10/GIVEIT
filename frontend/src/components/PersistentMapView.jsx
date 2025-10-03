import React, { useRef, useState, useCallback, useMemo } from 'react';
import { GoogleMap } from '@react-google-maps/api';
import LayerManager from './LayerManager';
import Popup from './Shared/Popup';
import useAndroidMapOptimization from '../hooks/useAndroidMapOptimization';

// CRITICAL: Preserve exact container style - no modifications allowed
const containerStyle = {
  width: "100%",
  height: "100%"
};

const defaultCenter = { lat: 32.0508, lng: 34.7658 };

const LoadingOverlay = ({ show }) => show ? (
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
      padding: '12px 20px',
      background: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      fontSize: '14px',
      color: '#666',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    }}>
      <div style={{
        width: '16px',
        height: '16px',
        border: '2px solid #e0e0e0',
        borderTop: '2px solid #14b8a6',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      Loading...
    </div>
  </div>
) : null;

const PersistentMapView = ({ data, isFetching, contentType, mapHeight = "420px" }) => {
  const mapRef = useRef(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  
  const { isAndroid } = useAndroidMapOptimization(mapRef);

  const handleMarkerClick = useCallback((item) => {
    setSelectedItem(item);
  }, []);

  const mapOptions = useMemo(() => ({
    disableDefaultUI: true,
    zoomControl: true,
    gestureHandling: "greedy",
    styles: [
      { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
      { featureType: "transit", elementType: "labels", stylers: [{ visibility: "off" }] }
    ],
    // Android-specific optimizations
    ...(isAndroid && {
      backgroundColor: '#f0f0f0',
      clickableIcons: false,
      disableDoubleClickZoom: false,
      draggable: true,
      keyboardShortcuts: false,
      scrollwheel: true,
      panControl: false,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false
    })
  }), [isAndroid]);

  return (
    <div style={{ 
      width: "100%", 
      height: mapHeight,
      position: "relative"
    }}>
      <LoadingOverlay show={isFetching && !mapLoaded} />
      
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={defaultCenter}
        zoom={13}
        options={mapOptions}
        onLoad={(map) => {
          mapRef.current = map;
          setMapLoaded(true);
        }}
      >
        <LayerManager 
          data={data} 
          onMarkerClick={handleMarkerClick}
        />
      </GoogleMap>

      {selectedItem && (
        <Popup 
          item={selectedItem} 
          onClose={() => setSelectedItem(null)}
          contentType={contentType}
        />
      )}
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default PersistentMapView;