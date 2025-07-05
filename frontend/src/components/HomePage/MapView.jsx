import React, { useState, useEffect, useRef } from "react";
import { GoogleMap, OverlayView } from "@react-google-maps/api";
import Popup from "../Shared/Popup";
import FilterButton from "./FilterButton";
import ToggleViewButton from "./ToggleViewButton";

const containerStyle = {
    width: "100%",
    height: "100%",
};

const defaultCenter = {
    lat: 32.0308,
    lng: 34.7658,
};

const getPixelPositionOffset = () => ({
    x: -(10 / 2),
    y: -(20 / 2),
});

const MapView = ({ locations, mapHeight, onBoundsChanged, children }) => {
    const [selectedItem, setSelectedItem] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const mapRef = useRef(null); // ref 
    // 
    //  control the map
    const hasSetInitialLocation = useRef(false); // Track if initial location was set

    useEffect(() => {
        if (hasSetInitialLocation.current || !navigator.geolocation) {
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const newLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                setUserLocation(newLocation);
                hasSetInitialLocation.current = true; // Prevent future updates
            },
            (error) => {
                console.error("Error getting user location:", error);
                setUserLocation(defaultCenter); // Fallback to default center
                hasSetInitialLocation.current = true;
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        );
    }, []);

    const handleMarkerClick = (item) => {
        console.log('[MapView] Item passed to handleMarkerClick:', item);
        if (!item) {
            console.error('[MapView] No item data provided to handleMarkerClick');
            return;
        }
        setSelectedItem(item);
    };

    const handlePopupClose = () => {
        setSelectedItem(null);
    };

    const handleReturnToLocation = () => {
        if (userLocation && mapRef.current) {
            mapRef.current.panTo(userLocation);
        }
    };

    const handleMapIdle = () => {
        if (mapRef.current) {
            if (onBoundsChanged) {
                const bounds = mapRef.current.getBounds();
                if (bounds) {
                    const ne = bounds.getNorthEast();
                    const sw = bounds.getSouthWest();
                    onBoundsChanged({
                        northEast: { lat: ne.lat(), lng: ne.lng() },
                        southWest: { lat: sw.lat(), lng: sw.lng() }
                    });
                }
            }
        }
    };

    const customMapStyle = [
        {
          featureType: "poi", // Hide points of interest (restaurants, etc.)
          elementType: "labels",
          stylers: [{ visibility: "off" }]
        },
        {
          featureType: "transit", // Hide transit stations
          elementType: "labels",
          stylers: [{ visibility: "off" }]
        },
        {
          featureType: "road",
          elementType: "labels", // Keep street labels
          stylers: [{ visibility: "on" }]
        },
        {
          featureType: "road",
          elementType: "geometry",
          stylers: [{ color: "#ffffff" }] // Clean white roads
        },
        {
          featureType: "landscape",
          elementType: "geometry",
          stylers: [{ color: "#f5f5f5" }]
        },
        {
          featureType: "water",
          elementType: "geometry",
          stylers: [{ color: "#d6e5fb" }]
        },
        {
          featureType: "administrative",
          elementType: "labels",
          stylers: [{ visibility: "on" }] // Optional: city names, etc.
        }
    ];

    // Fix the height calculation
    const getMapHeight = () => {
        if (mapHeight === "100%") {
            return "100%";
        }
        if (typeof mapHeight === "string" && mapHeight.includes("%")) {
            return mapHeight;
        }
        if (typeof mapHeight === "number") {
            return `${mapHeight}px`;
        }
        if (typeof mapHeight === "string" && mapHeight.includes("px")) {
            return mapHeight;
        }
        return "420px"; // fallback
    };

    const mapContainerStyle = {
        ...containerStyle,
        height: getMapHeight(),
        minHeight: "300px", // Ensure minimum height
    };

    console.log('MapView rendering with:', { 
        mapHeight, 
        calculatedHeight: getMapHeight(), 
        locationsCount: locations?.length || 0 
    });
      
    return (
<div
  className="w-full relative"
  style={{
    marginBottom: '64px',
    paddingTop: '100px', // <== תוספת כאן
    height: '100%',
  }}
>            {children}
            
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={userLocation || defaultCenter}
                zoom={15}
                onLoad={(map) => {
                    mapRef.current = map;
                    console.log('Google Map loaded successfully');
                }}
                onIdle={handleMapIdle}
                options={{
                    styles: customMapStyle,
                    gestureHandling: "greedy",
                    zoomControl: true,
                    scrollwheel: true, // Changed from false to true
                    mapTypeControl: false,
                    streetViewControl: false,
                    fullscreenControl: false,
                    keyboardShortcuts: false,
                }}
            >
                {locations && locations.map((item, index) => (
                    <OverlayView
                        key={item.id || index}
                        position={{ lat: item.lat, lng: item.lng }}
                        mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                        getPixelPositionOffset={getPixelPositionOffset}
                    >
                        <div
                            className="flex flex-col items-center cursor-pointer"
                            onClick={() => handleMarkerClick(item)}
                        >
                            {/* Custom brand pin */}
                            <div
                                className="brand-map-pin flex items-center justify-center rounded-full shadow-lg border-4 border-white map-pin-hover"
                                style={{ width: 44, height: 44, background: '#2E4057', position: 'relative' }}
                                title={item.title || "N/A"}
                            >
                                <span className="text-white font-bold text-[10px]" style={{ lineHeight: '44px', width: '100%', textAlign: 'center', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                                    {item.title ? item.title.split(' ')[0] : "?"}
                                </span>
                            </div>
                            {/* Price below pin */}
                            {item.price !== null && item.price !== undefined && (
                                <span className="block text-[10px] font-semibold mt-1 text-[#f55363] bg-white rounded px-2 py-0.5 shadow" style={{ marginTop: 2 }}>
                                    {item.price}₪
                                </span>
                            )}
                        </div>
                    </OverlayView>
                ))}

                {userLocation && (
                    <OverlayView
                        position={userLocation}
                        mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                    >
                        <div className="relative w-3 h-3">
                            <div className="absolute inset-1 rounded-full bg-cyan-400 animate-ping opacity-60"></div>
                            <div className="absolute inset-1 rounded-full bg-teal-500"></div>
                        </div>
                    </OverlayView>
                )}
            </GoogleMap>

            {userLocation && (
                <button
                    onClick={handleReturnToLocation}
                    className="fixed z-50 bottom-6 left-2 bg-white text-gray-800 font-semibold p-1 rounded-full shadow-lg border border-gray-300 hover:bg-gray-100 transition-colors flex items-center justify-center"
                    title="Return to my location"
                    style={{ width: 36, height: 36, minWidth: 36, minHeight: 36, boxShadow: '0 2px 8px rgba(0,0,0,0.18)' }}
                    data-testid="return-to-location-btn"
                >
<svg
  xmlns="http://www.w3.org/2000/svg"
  className="h-4\5 w-5 text-[#087E8B]"
  viewBox="0 0 24 24"
  fill="currentColor"
  stroke="currentColor" 

>
  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
</svg>


                </button>
            )}

            <Popup item={selectedItem} onClose={handlePopupClose} />
        </div>
    );
};

export default MapView;