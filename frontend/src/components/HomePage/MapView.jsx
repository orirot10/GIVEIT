import React, { useState, useEffect, useRef } from "react";
import { GoogleMap, OverlayView } from "@react-google-maps/api";
import Popup from "../Shared/Popup";

// Design System - Unified Color Palette & Typography
const DESIGN_TOKENS = {
    colors: {
        primary: {
            50: '#f0fdfa',
            100: '#ccfbf1',
            200: '#99f6e4',
            300: '#5eead4',
            400: '#2dd4bf',
            500: '#14b8a6', // Main accent
            600: '#0d9488',
            700: '#0f766e',
            800: '#115e59',
            900: '#134e4a'
        },
        neutral: {
            50: '#f8fafc',
            100: '#f1f5f9',
            200: '#e2e8f0',
            300: '#cbd5e1',
            400: '#94a3b8',
            500: '#64748b',
            600: '#475569',
            700: '#334155',
            800: '#1e293b',
            900: '#0f172a'
        },
        semantic: {
            success: '#10b981',
            warning: '#f59e0b',
            error: '#ef4444',
            info: '#3b82f6'
        }
    },
    typography: {
        fontFamily: {
            primary: "'Assistant', 'David Libre', Arial, sans-serif",
            secondary: "'Inter', 'Alef', Arial, sans-serif"
        },
        fontSize: {
            xs: '10px',
            sm: '12px',
            base: '14px',
            lg: '16px',
            xl: '18px',
            '2xl': '20px',
            '3xl': '24px'
        },
        fontWeight: {
            normal: 400,
            medium: 500,
            semibold: 600,
            bold: 700
        }
    },
    shadows: {
        sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px rgba(0, 0, 0, 0.07)',
        lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
        xl: '0 20px 25px rgba(0, 0, 0, 0.15)'
    }
};

const containerStyle = {
    width: "100%",
    height: "100%",
};

const defaultCenter = {
    lat: 32.0308,
    lng: 34.7658,
};

const getPixelPositionOffset = () => ({
    x: -(20 / 2),
    y: -(40 / 2),
});

const MapView = ({ locations, mapHeight, onBoundsChanged, children }) => {
    const [selectedItem, setSelectedItem] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const mapRef = useRef(null);
    const hasSetInitialLocation = useRef(false);

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
                hasSetInitialLocation.current = true;
            },
            (error) => {
                console.error("Error getting user location:", error);
                setUserLocation(defaultCenter);
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

    // Enhanced map style with better contrast
    const customMapStyle = [
        {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
        },
        {
            featureType: "transit",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
        },
        {
            featureType: "road",
            elementType: "labels",
            stylers: [{ visibility: "on" }]
        },
        {
            featureType: "road",
            elementType: "geometry",
            stylers: [{ color: "#ffffff" }]
        },
        {
            featureType: "landscape",
            elementType: "geometry",
            stylers: [{ color: DESIGN_TOKENS.colors.neutral[50] }]
        },
        {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: DESIGN_TOKENS.colors.primary[100] }]
        },
        {
            featureType: "administrative",
            elementType: "labels",
            stylers: [{ visibility: "on" }]
        }
    ];

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
        return "420px";
    };

    const mapContainerStyle = {
        ...containerStyle,
        height: getMapHeight(),
        minHeight: "300px",
    };

    // Get marker color based on item type
    const getMarkerColor = (item) => {
        if (item.type?.includes('request')) {
            return DESIGN_TOKENS.colors.semantic.warning; // Orange for wanted items
        }
        return DESIGN_TOKENS.colors.semantic.success; // Green for available items
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
                paddingTop: '100px',
                height: '100%',
                fontFamily: DESIGN_TOKENS.typography.fontFamily.primary
            }}
        >
            {children}
            
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
                    disableDefaultUI: true, 
                    zoomControl: true,
                    rotateControl: false, 
                    scrollwheel: true,
                    mapTypeControl: false,
                    streetViewControl: false,
                    fullscreenControl: false,
                    keyboardShortcuts: false,
                }}
            >
                {locations && locations.map((item, index) => (
                    <MemoizedMarker
                        key={item.id || index}
                        item={item}
                        getMarkerColor={getMarkerColor}
                        handleMarkerClick={handleMarkerClick}
                    />
                ))}

                {/* Enhanced user location marker */}
                {userLocation && (
                    <OverlayView
                        position={userLocation}
                        mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                    >
                        <div className="relative" style={{ width: '16px', height: '16px' }}>
                            <div 
                                className="absolute inset-0 rounded-full animate-ping opacity-60"
                                style={{ 
                                    background: DESIGN_TOKENS.colors.primary[400],
                                    animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite'
                                }}
                            ></div>
                            <div 
                                className="absolute inset-0 rounded-full"
                                style={{ background: DESIGN_TOKENS.colors.primary[500] }}
                            ></div>
                        </div>
                    </OverlayView>
                )}
            </GoogleMap>

            {/* Enhanced return to location button */}
            {userLocation && (
                <button
                    onClick={handleReturnToLocation}
                    className="absolute z-50 font-semibold rounded-full shadow-lg border transition-colors flex items-center justify-center"
                    title="Return to my location"
                    data-testid="return-to-location-btn"
                    style={{ 
                        background: 'white',
                        color: DESIGN_TOKENS.colors.neutral[700],
                        border: `2px solid ${DESIGN_TOKENS.colors.neutral[200]}`,
                        boxShadow: DESIGN_TOKENS.shadows.lg,
                        width: 48,
                        height: 48,
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        fontFamily: DESIGN_TOKENS.typography.fontFamily.primary,
                        bottom: 90,
                        left: 15
                    }}
                    onMouseOver={e => {
                        e.currentTarget.style.background = DESIGN_TOKENS.colors.neutral[50];
                        e.currentTarget.style.border = `2px solid ${DESIGN_TOKENS.colors.neutral[300]}`;
                        e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseOut={e => {
                        e.currentTarget.style.background = 'white';
                        e.currentTarget.style.border = `2px solid ${DESIGN_TOKENS.colors.neutral[200]}`;
                        e.currentTarget.style.transform = 'scale(1)';
                    }}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={DESIGN_TOKENS.colors.neutral[700]}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ width: 20, height: 20 }}
                    >
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
                    </svg>
                </button>
            )}

            <Popup item={selectedItem} onClose={handlePopupClose} />
        </div>
    );
};

// Memoized OverlayView marker
const MemoizedMarker = React.memo(function MemoizedMarker({ item, getMarkerColor, handleMarkerClick }) {
    return (
        <OverlayView
            key={item.id}
            position={{ lat: item.lat, lng: item.lng }}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            getPixelPositionOffset={getPixelPositionOffset}
        >
            <div
                className="flex flex-col items-center cursor-pointer"
                onClick={() => handleMarkerClick(item)}
                style={{ transition: 'all 0.2s ease' }}
            >
                <div
                    className="brand-map-pin flex items-center justify-center rounded-full shadow-lg border-2 border-white map-pin-hover"
                    style={{
                        width: 40,
                        height: 40,
                        background: getMarkerColor(item),
                        position: 'relative',
                        boxShadow: DESIGN_TOKENS.shadows.lg,
                        transition: 'all 0.2s ease'
                    }}
                    title={item.title || "N/A"}
                    onMouseOver={e => {
                        e.currentTarget.style.transform = 'scale(1.1)';
                        e.currentTarget.style.boxShadow = DESIGN_TOKENS.shadows.xl;
                    }}
                    onMouseOut={e => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = DESIGN_TOKENS.shadows.lg;
                    }}
                >
                    <span
                        className="text-white font-bold"
                        style={{
                            fontSize: DESIGN_TOKENS.typography.fontSize.xs,
                            fontWeight: DESIGN_TOKENS.typography.fontWeight.bold,
                            lineHeight: '40px',
                            width: '100%',
                            textAlign: 'center',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            fontFamily: DESIGN_TOKENS.typography.fontFamily.primary
                        }}
                    >
                        {item.title ? item.title.split(' ')[0] : "?"}
                    </span>
                </div>
                {item.price !== null && item.price !== undefined && (
                    <div
                        className="price-pill"
                        style={{
                            background: 'white',
                            color: DESIGN_TOKENS.colors.neutral[800],
                            borderRadius: '12px',
                            padding: '4px 8px',
                            marginTop: '4px',
                            fontSize: DESIGN_TOKENS.typography.fontSize.xs,
                            fontWeight: DESIGN_TOKENS.typography.fontWeight.semibold,
                            boxShadow: DESIGN_TOKENS.shadows.md,
                            border: `1px solid ${DESIGN_TOKENS.colors.neutral[200]}`,
                            fontFamily: DESIGN_TOKENS.typography.fontFamily.primary,
                            minWidth: 'fit-content',
                            textAlign: 'center'
                        }}
                    >
                        {item.price}₪
                    </div>
                )}
            </div>
        </OverlayView>
    );
});

export default MapView;