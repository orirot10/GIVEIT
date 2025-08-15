import React, { useState, useEffect, useRef, Suspense } from "react";
import Popup from "../Shared/Popup";

const GoogleMap = React.lazy(() => import("@react-google-maps/api").then(m => ({ default: m.GoogleMap })));
const OverlayView = React.lazy(() => import("@react-google-maps/api").then(m => ({ default: m.OverlayView })));

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
    lat: 32.0508,
    lng: 34.7658,
};



const MapView = ({ locations, mapHeight, onBoundsChanged, children, contentType }) => {
    const [selectedItem, setSelectedItem] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [mapLoadError, setMapLoadError] = useState(false);
    const [isMapLoaded, setIsMapLoaded] = useState(false);
    const [isAndroid, setIsAndroid] = useState(false);
    const mapRef = useRef(null);
    const hasSetInitialLocation = useRef(false);


    // Fit the map so that its visible WIDTH is exactly `widthKm` around `center`
    const fitMapToWidthInKm = (center, widthKm = 1) => {
        if (!center || !mapRef.current || !window.google) return;
        const mapDiv = mapRef.current.getDiv();
        const widthPx = mapDiv?.clientWidth || 1;
        const heightPx = mapDiv?.clientHeight || 1;

        const lat = center.lat;
        const lngMetersPerDegree = 111320 * Math.cos((lat * Math.PI) / 180);
        const widthDegrees = (widthKm * 1000) / Math.max(lngMetersPerDegree, 1e-6);
        const heightDegrees = widthDegrees * (heightPx / widthPx);

        const bounds = new window.google.maps.LatLngBounds(
            { lat: center.lat - heightDegrees / 2, lng: center.lng - widthDegrees / 2 },
            { lat: center.lat + heightDegrees / 2, lng: center.lng + widthDegrees / 2 }
        );
        mapRef.current.fitBounds(bounds);
    };

    const setMapToUserLocation = (location) => {
        if (!location) return;
        fitMapToWidthInKm(location, 1);
    };

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
                
                // Set map bounds to show 1km radius after a short delay
                setTimeout(() => {
                    setMapToUserLocation(newLocation);
                }, 100);
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

    // Check if running on Android
    useEffect(() => {
        if (window.Capacitor) {
            const platform = window.Capacitor.getPlatform();
            setIsAndroid(platform === 'android');
            console.log('MapView: Platform detected:', platform);
        }
    }, []);

    // Enhanced map refresh for Android
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible' && mapRef.current) {
                console.log('MapView: Page became visible, refreshing map...');
                // Force map refresh by triggering a resize event
                setTimeout(() => {
                    if (mapRef.current && window.google && window.google.maps) {
                        try {
                            window.google.maps.event.trigger(mapRef.current, 'resize');
                            console.log('MapView: Map resize triggered');
                            
                            // Additional Android WebView fixes
                            if (window.Capacitor && window.Capacitor.getPlatform() === 'android') {
                                // Force map to redraw
                                setTimeout(() => {
                                    if (mapRef.current) {
                                        const center = mapRef.current.getCenter();
                                        if (center) {
                                            mapRef.current.setCenter(center);
                                        }
                                    }
                                }, 200);
                            }
                        } catch (error) {
                            console.error('MapView: Error refreshing map:', error);
                        }
                    }
                }, 100);
            }
        };

        const handleFocus = () => {
            if (mapRef.current) {
                console.log('MapView: Window gained focus, refreshing map...');
                // Force map refresh
                setTimeout(() => {
                    if (mapRef.current && window.google && window.google.maps) {
                        try {
                            window.google.maps.event.trigger(mapRef.current, 'resize');
                            console.log('MapView: Map resize triggered on focus');
                            
                            // Android-specific focus handling
                            if (window.Capacitor && window.Capacitor.getPlatform() === 'android') {
                                setTimeout(() => {
                                    if (mapRef.current) {
                                        const center = mapRef.current.getCenter();
                                        if (center) {
                                            mapRef.current.setCenter(center);
                                        }
                                    }
                                }, 200);
                            }
                        } catch (error) {
                            console.error('MapView: Error refreshing map on focus:', error);
                        }
                    }
                }, 100);
            }
        };

        // Listen for visibility and focus changes
        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('focus', handleFocus);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('focus', handleFocus);
        };
    }, []);

    // Force map refresh when locations change significantly
    useEffect(() => {
        if (mapRef.current && locations && locations.length > 0) {
            // Trigger map refresh when locations change
            setTimeout(() => {
                if (mapRef.current) {
                    window.google.maps.event.trigger(mapRef.current, 'resize');
                    console.log('MapView: Map refreshed due to location changes');
                }
            }, 50);
        }
    }, [locations?.length]);

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
            setMapToUserLocation(userLocation);
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


      
    return (
        <div
            className="w-full relative"
            style={{
                marginBottom: '40px',
                paddingTop: '80px',
                height: '100%',
                fontFamily: DESIGN_TOKENS.typography.fontFamily.primary
            }}
        >

            
            {children}

            {!isMapLoaded && !mapLoadError && (
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        background: 'rgba(255, 255, 255, 0.9)',
                        padding: '20px',
                        borderRadius: '12px',
                        textAlign: 'center',
                        zIndex: 1000,
                        fontFamily: DESIGN_TOKENS.typography.fontFamily.primary,
                    }}
                >
                    <p
                        style={{
                            color: DESIGN_TOKENS.colors.neutral[700],
                            fontSize: DESIGN_TOKENS.typography.fontSize.base,
                            fontWeight: DESIGN_TOKENS.typography.fontWeight.medium,
                            margin: 0,
                        }}
                    >
                        Loading map...
                    </p>
                </div>
            )}

            {/* Fallback UI when map fails to load */}
            {mapLoadError && (
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: 'rgba(255, 255, 255, 0.95)',
                    padding: '20px',
                    borderRadius: '12px',
                    textAlign: 'center',
                    zIndex: 1000,
                    maxWidth: '300px',
                    fontFamily: DESIGN_TOKENS.typography.fontFamily.primary
                }}>
                    <div style={{
                        fontSize: 48,
                        marginBottom: '16px',
                        opacity: 0.6,
                        color: DESIGN_TOKENS.colors.semantic.error
                    }}>
                        🗺️
                    </div>
                    <p style={{
                        color: DESIGN_TOKENS.colors.neutral[700],
                        fontSize: DESIGN_TOKENS.typography.fontSize.base,
                        fontWeight: DESIGN_TOKENS.typography.fontWeight.medium,
                        margin: '0 0 16px 0'
                    }}>
                        {isAndroid ? 'Map loading issue detected' : 'Map failed to load'}
                    </p>
                    <p style={{
                        color: DESIGN_TOKENS.colors.neutral[500],
                        fontSize: DESIGN_TOKENS.typography.fontSize.sm,
                        margin: '0 0 16px 0'
                    }}>
                        {isAndroid ? 'This is a known issue with Android WebView. Please try refreshing the app.' : 'Please check your internet connection and try again.'}
                    </p>
                    <button
                        onClick={() => {
                            setMapLoadError(false);
                            if (mapRef.current && window.google && window.google.maps) {
                                try {
                                    window.google.maps.event.trigger(mapRef.current, 'resize');
                                } catch (error) {
                                    console.error('Error retrying map:', error);
                                }
                            }
                        }}
                        style={{
                            background: DESIGN_TOKENS.colors.primary[500],
                            color: 'white',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: DESIGN_TOKENS.typography.fontSize.sm,
                            fontWeight: DESIGN_TOKENS.typography.fontWeight.medium
                        }}
                    >
                        Retry Map
                    </button>
                </div>
            )}
            
            <Suspense fallback={<div className="p-4 text-center">Loading map...</div>}>
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={userLocation || defaultCenter}
                onLoad={(map) => {
                    setIsMapLoaded(true);
                    mapRef.current = map;
                    console.log('Google Map loaded successfully');
                    console.log('Map container style:', mapContainerStyle);
                    console.log('Map center:', userLocation || defaultCenter);
                    
                    // Android WebView specific initialization
                    if (isAndroid) {
                        console.log('MapView: Android platform detected, applying WebView fixes');
                        
                        // Force map to initialize properly in WebView
                        setTimeout(() => {
                            try {
                                if (map && window.google && window.google.maps) {
                                    // Trigger resize to ensure proper rendering
                                    window.google.maps.event.trigger(map, 'resize');
                                    
                                    // Set a small zoom level to force map tiles to load
                                    const currentZoom = map.getZoom();
                                    map.setZoom(currentZoom + 0.1);
                                    setTimeout(() => {
                                        map.setZoom(currentZoom);
                                    }, 100);
                                    
                                    console.log('MapView: Android WebView initialization complete');
                                }
                            } catch (error) {
                                console.error('MapView: Android WebView initialization error:', error);
                            }
                        }, 500);
                    }
                    
                    // Set initial bounds if user location is already available
                    if (userLocation) {
                        setTimeout(() => {
                            setMapToUserLocation(userLocation);
                        }, 100);
                    }
                }}
                onError={(error) => {
                    console.error('Google Map error:', error);
                    setMapLoadError(true);
                    
                    // Android-specific error handling
                    if (isAndroid) {
                        console.error('MapView: Android WebView map error detected');
                        
                        // Try to recover from common WebView issues
                        setTimeout(() => {
                            if (mapRef.current) {
                                try {
                                    window.google.maps.event.trigger(mapRef.current, 'resize');
                                    setMapLoadError(false);
                                    console.log('MapView: Attempting to recover from error');
                                } catch (recoveryError) {
                                    console.error('MapView: Recovery failed:', recoveryError);
                                }
                            }
                        }, 1000);
                    }
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
                    
                    // Android WebView specific options
                    ...(isAndroid ? {
                        backgroundColor: '#f0f0f0',
                        clickableIcons: false,
                        disableDoubleClickZoom: false,
                        draggable: true,
                        draggableCursor: 'grab',
                        draggingCursor: 'grabbing'
                    } : {})
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
                        mapPaneName="overlayMouseTarget"
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
            </Suspense>

            {/* Enhanced return to location button */}
            {userLocation && (
                <button
                    onClick={handleReturnToLocation}
                    className="absolute z-50 font-semibold rounded-full shadow-lg border transition-colors flex items-center justify-center"
                    title="Return to my location (1 km width)"
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

            <Popup item={selectedItem} onClose={handlePopupClose} contentType={contentType} />
        </div>
    );
};

// Memoized OverlayView marker
const MemoizedMarker = React.memo(function MemoizedMarker({ item, getMarkerColor, handleMarkerClick }) {
    return (
        <OverlayView
            key={item.id}
            position={{ lat: item.lat, lng: item.lng }}
            mapPaneName="overlayMouseTarget"
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