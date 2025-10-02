import React, { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import PersistentMapView from '../PersistentMapView';
import TabBar from './TabBar';
import useMapData from '../../hooks/useMapData';

const useDebounce = (callback, delay) => {
  const timeoutRef = React.useRef(null);
  return useCallback((...args) => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => callback(...args), delay);
  }, [callback, delay]);
};

const PersistentMapPage = ({ apiUrl }) => {
  const initialContentType = apiUrl.includes('/services') ? 'services' : 'rentals';
  const [contentType, setContentType] = useState(initialContentType);
  
  const { data, isFetching, error } = useMapData(contentType);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const tabs = useMemo(() => {
    const isRental = contentType.includes('rental');
    return isRental ? [
      { id: 'rental_requests', label: t('Wanted Products') || 'Wanted Products' },
      { id: 'rentals', label: t('Available Products') || 'Available Products' }
    ] : [
      { id: 'service_requests', label: t('Wanted Services') || 'Wanted Services' },
      { id: 'services', label: t('Available Services') || 'Available Services' }
    ];
  }, [contentType, t]);

  const debouncedTabChange = useDebounce((newType) => {
    if (newType !== contentType) {
      setContentType(newType);
    }
  }, 150);

  const handleAddListing = useCallback(() => {
    const routes = {
      rentals: '/offer-rental',
      services: '/offer-service', 
      rental_requests: '/request-rental',
      service_requests: '/request-service'
    };
    navigate(routes[contentType] || '/');
  }, [contentType, navigate]);

  return (
    <div style={{
      width: '100vw',
      height: 'calc(100vh - 80px)',
      position: 'relative'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        padding: '12px 8px',
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '8px'
        }}>
          <div />
          <button
            onClick={handleAddListing}
            style={{
              background: 'transparent',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>
        
        <TabBar
          activeTab={contentType}
          onTabChange={debouncedTabChange}
          tabs={tabs}
          loading={isFetching}
        />
      </div>

      <PersistentMapView
        data={data}
        isFetching={isFetching}
        contentType={contentType}
        mapHeight="100%"
      />

      <button
        onClick={handleAddListing}
        style={{
          position: 'fixed',
          bottom: 90,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          width: 56,
          height: 56,
          background: '#087E8B',
          color: '#fff',
          border: 'none',
          borderRadius: '50%',
          fontSize: 24,
          cursor: 'pointer',
          boxShadow: '0 6px 20px rgba(8, 126, 139, 0.3)'
        }}
      >
        +
      </button>

      {error && (
        <div style={{
          position: 'fixed',
          top: 100,
          right: 20,
          background: '#ff4444',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '4px',
          fontSize: '14px',
          zIndex: 2000
        }}>
          Error: {error}
        </div>
      )}
    </div>
  );
};

export default PersistentMapPage;