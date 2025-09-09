import React, { createContext, useContext, useRef, useState } from 'react';

const MapContext = createContext(null);

export const MapProvider = ({ children }) => {
  // persistent map instance and cached locations
  const mapRef = useRef(null);
  const [locations, setLocations] = useState([]);
  const [contentType, setContentType] = useState('services');
  const [mapBounds, setMapBounds] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  return (
    <MapContext.Provider value={{ 
      mapRef, 
      locations, 
      setLocations, 
      contentType, 
      setContentType,
      mapBounds,
      setMapBounds,
      userLocation,
      setUserLocation,
      isMapLoaded,
      setIsMapLoaded
    }}>
      {children}
    </MapContext.Provider>
  );
};

export const useMapContext = () => {
  const ctx = useContext(MapContext);
  if (!ctx) {
    throw new Error('useMapContext must be used within a MapProvider');
  }
  return ctx;
};

export default MapContext;
