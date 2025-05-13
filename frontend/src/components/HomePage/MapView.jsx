import React, { useState, useEffect, useRef } from "react";
import { GoogleMap, OverlayView } from "@react-google-maps/api";
import Popup from "../Shared/Popup";

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

const MapView = ({ locations }) => {
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

    return (
        <div className="w-full h-[500px] relative">
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={userLocation || defaultCenter}
                zoom={15}
                onLoad={(map) => {
                    mapRef.current = map;
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
             <div
    className="bg-indigo-800 text-white rounded-md max-w-[120px] px-3 py-2 flex items-center justify-center text-[12px] font-semibold shadow-md transition-colors text-center overflow-hidden"
    title={item.title || "N/A"}
>
<span className="block truncate w-full">
&nbsp;&nbsp;{item.title || "N/A"}&nbsp;
</span>
</div>

                            {(item.price !== null && item.price !== undefined) && (
                                 <div className="mt-1 bg-green-900 text-white text-[10px] font-semibold rounded-md px-2 py-0.5 shadow-sm">
                                 &nbsp;{item.price}₪&nbsp;
                             </div>
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
                    className="absolute bottom-2 left-2 bg-white text-gray-800 font-semibold p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
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