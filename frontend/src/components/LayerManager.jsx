import React, { useMemo } from 'react';
import { OverlayView } from '@react-google-maps/api';

const MapMarker = React.memo(({ item, onClick }) => (
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

const LayerManager = ({ data, onMarkerClick }) => {
  const markers = useMemo(() => 
    data.map((item, index) => (
      <MapMarker
        key={item.id || index}
        item={item}
        onClick={onMarkerClick}
      />
    )), [data, onMarkerClick]
  );

  return <>{markers}</>;
};

export default LayerManager;