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
    lat: 32.0408,
    lng: 34.7658,
};

const getPixelPositionOffset = () => ({
    x: -(40 / 2),
    y: -(60 / 2),
});

const MapView = ({ locations, onApplyFilters, categoryType, view, setView, mapHeight, onBoundsChanged }) => {
    const [selectedItem, setSelectedItem] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const mapRef = useRef(null); // ref to control the map
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
      
      
    return (
        <div className="w-full relative" style={{ marginBottom: '64px' }}>
            {/* FilterButton in top-left corner */}
            <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 10 }}>
                <FilterButton onApplyFilters={onApplyFilters} categoryType={categoryType} />
            </div>
            {/* ToggleViewButton in top-right corner */}
            <div style={{ position: 'absolute', top: 4, right: 4, zIndex: 10 }}>
                <ToggleViewButton view={view} setView={setView} />
            </div>
            <GoogleMap
                mapContainerStyle={{ ...containerStyle, height: mapHeight ? `${mapHeight}px` : '420px' }}
                center={userLocation || defaultCenter}
                zoom={15}
                onLoad={(map) => {
                    mapRef.current = map;
                }}
                onIdle={handleMapIdle}
                options={{
                    styles: customMapStyle,
                    gestureHandling: "greedy",
                    zoomControl: true,
                    scrollwheel: false,
                    mapTypeControl: false,
                    streetViewControl: false,
                    fullscreenControl: false,
                    keyboardShortcuts: false,
                    /*
                    disableDefaultUI: false,
                    panControl: false,
                    rotateControl: false,
                    scaleControl: false,
                    clickableIcons: false,*/
                }}
            >
                {locations.map((item, index) => (
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
                                style={{ width: 44, height: 44, background: '#26A69A', position: 'relative' }}
                                title={item.title || "N/A"}
                            >
                                <span className="text-white font-bold text-[12px]" style={{ lineHeight: '44px', width: '100%', textAlign: 'center', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                                    {item.title ? item.title.split(' ')[0] : "?"}

                                </span>
                                {/* Optionally, add a brand SVG icon here */}
                            </div>
                            {/* Price below pin */}
                            {item.price !== null && item.price !== undefined && (
                                <span className="block text-[13px] font-semibold mt-1 text-[#f55363] bg-white rounded px-2 py-0.5 shadow" style={{ marginTop: 2 }}>
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
                    className="absolute bottom-4 left-2 bg-white text-gray-800 font-semibold p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                    title="Return to my location"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                    </svg>
                </button>
            )}

            <Popup item={selectedItem} onClose={handlePopupClose} />
        </div>
    );
};

export default MapView;