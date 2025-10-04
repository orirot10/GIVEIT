import React, { useMemo, useEffect } from 'react';
import { OverlayView } from '@react-google-maps/api';

// Memoized marker - prevents recreation on every render
const MapMarker = React.memo<{ item: any; onClick: (item: any) => void }>(({ item, onClick }) => (
  <OverlayView
    position={{ lat: item.lat, lng: item.lng }}
    mapPaneName="overlayMouseTarget"
  >
    <div
      onClick={() => onClick(item)}
      style={{
        width: 50,
        height: 50,
        background: item.type?.includes('request') ? '#7dd3fc' : '#bfdbfe',
        borderRadius: '50%',
        border: '2px solid white',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        fontWeight: 'bold',
        color: '#0b6052',
        transition: 'transform 0.2s'
      }}
      onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
      onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
    >
      {item.title?.split(' ').slice(0, 2).join(' ') || '?'}
    </div>
  </OverlayView>
));

interface LayerManagerProps {
  tabType: string;
  data: any[];
  onMarkerClick: (item: any) => void;
  preserveViewport: () => { center: any; zoom: number } | null;
}

const LayerManager: React.FC<LayerManagerProps> = ({ 
  tabType, 
  data, 
  onMarkerClick, 
  preserveViewport 
}) => {
  // Preserve viewport before layer updates
  useEffect(() => {
    const viewport = preserveViewport();
    console.log(`LayerManager: Switching to ${tabType}, preserving viewport:`, viewport);
    
    // VERIFICATION: Only markers change, never map container or viewport
    return () => {
      const newViewport = preserveViewport();
      if (viewport && newViewport) {
        const centerChanged = Math.abs(viewport.center?.lat - newViewport.center?.lat) > 0.0001;
        const zoomChanged = Math.abs(viewport.zoom - newViewport.zoom) > 0.1;
        if (centerChanged || zoomChanged) {
          console.warn('LayerManager: Viewport changed unexpectedly!', { viewport, newViewport });
        }
      }
    };
  }, [tabType, preserveViewport]);

  // Memoized markers prevent unnecessary re-renders
  const markers = useMemo(() => 
    data.map((item, index) => (
      <MapMarker
        key={item.id || `${tabType}-${index}`}
        item={item}
        onClick={onMarkerClick}
      />
    )), [data, tabType, onMarkerClick]
  );

  // VERIFICATION: Only return overlay elements, never touch base map
  return <>{markers}</>;
};

export default LayerManager;