import React, { createContext, useContext, useRef, useState } from 'react';

const MapContext = createContext(null);

export const MapProvider = ({ children }) => {
  // persistent map instance and cached locations
  const mapRef = useRef(null);
  const [locations, setLocations] = useState([]);
  const [contentType, setContentType] = useState('services');

  return (
    <MapContext.Provider value={{ mapRef, locations, setLocations, contentType, setContentType }}>
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
