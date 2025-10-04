import React, { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import MapShell from './MapShell';
import TabBar from './HomePage/TabBar';
import useMapData from '../hooks/useMapData';
import useAndroidOptimizations from '../hooks/useAndroidOptimizations';

interface InstantMapPageProps {
  apiUrl: string;
}

const InstantMapPage: React.FC<InstantMapPageProps> = ({ apiUrl }) => {
  const initialTabType = apiUrl.includes('/services') ? 'services' : 'rentals';
  const [tabType, setTabType] = useState(initialTabType);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  
  const { data, isFetching, error } = useMapData(tabType);
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Tabs configuration
  const tabs = useMemo(() => {
    const isRental = tabType.includes('rental');
    return isRental ? [
      { id: 'rental_requests', label: t('Wanted Products') || 'Wanted Products' },
      { id: 'rentals', label: t('Available Products') || 'Available Products' }
    ] : [
      { id: 'service_requests', label: t('Wanted Services') || 'Wanted Services' },
      { id: 'services', label: t('Available Services') || 'Available Services' }
    ];
  }, [tabType, t]);

  const handleTabChange = useCallback((newType: string) => {
    if (newType !== tabType) {
      console.log(`InstantMapPage: Tab switch ${tabType} → ${newType}`);
      setTabType(newType);
    }
  }, [tabType]);

  const handleMarkerClick = useCallback((item: any) => {
    setSelectedItem(item);
  }, []);

  const handleAddListing = useCallback(() => {
    const routes: Record<string, string> = {
      rentals: '/offer-rental',
      services: '/offer-service', 
      rental_requests: '/request-rental',
      service_requests: '/request-service'
    };
    navigate(routes[tabType] || '/');
  }, [tabType, navigate]);

  return (
    <div style={{
      width: '100vw',
      height: 'calc(100vh - 80px)',
      position: 'relative'
    }}>
      {/* Controls overlay - absolute positioned to avoid layout changes */}
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
          activeTab={tabType}
          onTabChange={handleTabChange}
          tabs={tabs}
          loading={isFetching}
        />
      </div>

      {/* Persistent map - NEVER remounts */}
      <MapShell
        tabType={tabType}
        data={data}
        isFetching={isFetching}
        onMarkerClick={handleMarkerClick}
      />

      {/* FAB */}
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

      {/* Error toast - non-blocking */}
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

      {/* Popup for selected item */}
      {selectedItem && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          zIndex: 2000,
          maxWidth: '300px'
        }}>
          <h3>{selectedItem.title}</h3>
          <p>{selectedItem.description}</p>
          <button
            onClick={() => setSelectedItem(null)}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer'
            }}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default InstantMapPage;