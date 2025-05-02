import React, { useState, useEffect, useRef } from "react";
import { GoogleMap, OverlayView, Marker, Circle } from "@react-google-maps/api";
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

    useEffect(() => {
        let watchId;

        if (navigator.geolocation) {
            watchId = navigator.geolocation.watchPosition(
                (position) => {
                    const newLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    setUserLocation(newLocation);

                    // Recenter map on location change
                    if (mapRef.current) {
                        mapRef.current.panTo(newLocation);
                    }
                },
                (error) => {
                    console.error("Error getting user location:", error);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0,
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
        }

        return () => {
            if (watchId) {
                navigator.geolocation.clearWatch(watchId);
            }
        };
    }, []);

    const handleMarkerClick = (item) => {
        setSelectedItem(item);
    };

    const handlePopupClose = () => {
        setSelectedItem(null);
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
                                className="bg-blue-500 text-white rounded-md w-2 h-1 flex items-center justify-center text-[10px] font-semibold shadow-md transition-colors p-0 text-center overflow-hidden"
                                title={item.title || "N/A"}
                            >
                                <span className="truncate">{item.title || "N/A"}</span>
                            </div>

                            {(item.price !== null && item.price !== undefined) && (
                                <div className="mt-1 bg-green-500 text-white text-[9px] font-medium rounded-full px-2 py-0.5 shadow">
                                    {item.price}₪
                                </div>
                            )}
                        </div>
                    </OverlayView>
                ))}

                {userLocation && (
                    <>
                        <Marker position={userLocation} title="Your Location" />
                        <Circle
                            center={userLocation}
                            radius={1000}
                            options={{
                                strokeColor: "#4285F4",
                                strokeOpacity: 0.8,
                                strokeWeight: 2,
                                fillColor: "#4285F4",
                                fillOpacity: 0.2,
                                clickable: false,
                                draggable: false,
                                editable: false,
                                visible: true,
                            }}
                        />
                    </>
                )}
            </GoogleMap>

            <Popup item={selectedItem} onClose={handlePopupClose} />
        </div>
    );
};

export default MapView;
