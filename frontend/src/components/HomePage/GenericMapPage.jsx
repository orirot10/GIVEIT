import React, { useEffect, useState, useRef, useMemo } from "react";
import MapView from "./MapView";
import ListView from "./ListView";
import FilterButton from './FilterButton';
import ToggleViewButton from "./ToggleViewButton";
import TabBar from "./TabBar";
import SearchBar from "./SearchBar";
import '../../styles/HomePage/GenericMapPage.css';
import { handleSearch as searchItems } from "./searchHelpers";
import { useTranslation } from 'react-i18next';
import { useAuthContext } from '../../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

const GenericMapPage = ({ title, apiUrl }) => {
    const [allItems, setAllItems] = useState([]);
    const [locations, setLocations] = useState([]);
    const [view, setView] = useState("map");
    const [contentType, setContentType] = useState(apiUrl.includes('/services') ? 'services' : 'rentals');
    const [searchQuery, setSearchQuery] = useState("");
    const [userLocation, setUserLocation] = useState(null);
    const [mapBounds, setMapBounds] = useState(null);
    const boundsTimeout = useRef(null);
    const lastFetchedBounds = useRef(null);
    const { t, i18n } = useTranslation();
    const { user } = useAuthContext();
    const navigate = useNavigate();

    // Define tabs based on contentType and language
    const tabs = useMemo(() => {
        if (contentType.includes('rental')) {
            return [
                { id: 'rentals', label: i18n.language === 'he' ? t('Available Products') : 'Available Products' },
                { id: 'rental_requests', label: i18n.language === 'he' ? t('Wanted Products') : 'Wanted Products' }
            ];
        } else {
            return [
                { id: 'services', label: i18n.language === 'he' ? t('Available Services') : 'Available Services' },
                { id: 'service_requests', label: i18n.language === 'he' ? t('Wanted Services') : 'Wanted Services' }
            ];
        }
    }, [contentType, i18n.language, t]);

    // Function to get the appropriate API URL based on content type
    const getApiUrl = () => {
        const baseUrl = import.meta.env.VITE_API_URL;
        switch (contentType) {
            case 'rentals':
                return `${baseUrl}/api/rentals`;
            case 'services':
                return `${baseUrl}/api/services`;
            case 'rental_requests':
                return `${baseUrl}/api/rental_requests`;
            case 'service_requests':
                return `${baseUrl}/api/service_requests`;
            default:
                return `${baseUrl}/api/rentals`;
        }
    };

    // Function to get the appropriate category type for FilterButton
    const getCategoryType = () => {
        switch (contentType) {
            case 'rentals':
            case 'rental_requests':
                return 'rental';
            case 'services':
            case 'service_requests':
                return 'service';
            default:
                return 'rental';
        }
    };

    // Function to get the display title based on content type
    const getDisplayTitle = () => {
        switch (contentType) {
            case 'rentals':
                return i18n.language === 'he' ? t('Available Products') : 'Available Products';
            case 'services':
                return i18n.language === 'he' ? t('Available Services') : 'Available Services';
            case 'rental_requests':
                return i18n.language === 'he' ? t('Wanted Products') : 'Wanted Products';
            case 'service_requests':
                return i18n.language === 'he' ? t('Wanted Services') : 'Wanted Services';
            default:
                return title || (i18n.language === 'he' ? t('Explore') : 'Explore');
        }
    };

    // Get user location on mount
    useEffect(() => {
        if (!userLocation && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                (error) => {
                    console.error('Error getting user location:', error);
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        }
    }, [userLocation]);

    // Debounced fetch for items within bounds
    useEffect(() => {
        if (!mapBounds) return;
        const boundsKey = JSON.stringify(mapBounds) + contentType;
        if (lastFetchedBounds.current === boundsKey) return;
        if (boundsTimeout.current) clearTimeout(boundsTimeout.current);
        boundsTimeout.current = setTimeout(() => {
            fetchItemsWithinBounds(mapBounds);
            lastFetchedBounds.current = boundsKey;
        }, 300);
        return () => clearTimeout(boundsTimeout.current);
    }, [mapBounds, contentType]);

    // Fetch items within bounds
    const fetchItemsWithinBounds = async (bounds) => {
        // setLoading(true); // Removed loading state
        try {
            const currentApiUrl = getApiUrl();
            const { northEast, southWest } = bounds;
            const url = `${currentApiUrl}?minLat=${southWest.lat}&maxLat=${northEast.lat}&minLng=${southWest.lng}&maxLng=${northEast.lng}`;
            const res = await fetch(url);
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const items = await res.json();
            setAllItems(items);
            const withCoords = await mapItemsToCoords(items);
            setLocations(withCoords);
            // setLoading(false); // Removed loading state
        } catch {
            setAllItems([]);
            setLocations([]);
            // setLoading(false); // Removed loading state
        }
    };

    const mapItemsToCoords = async (items) => {
        return items
            .filter(item => typeof item.lat === 'number' && typeof item.lng === 'number')
            .map(item => ({
                ...item,
                id: item._id || item.id,
                type: contentType
            }));
    };

    const handleSearch = () => {
        const currentApiUrl = getApiUrl();
        searchItems({ apiUrl: currentApiUrl, searchQuery, setAllItems, setLocations });
    };

    const handleFilter = ({ categories, minPrice, maxPrice }) => {
        const currentApiUrl = getApiUrl();
        let url = `${currentApiUrl}/filter?`;
        if (categories.length > 0) {
            const encodedCategories = categories.map(encodeURIComponent).join(",");
            url += `category=${encodedCategories}&`;
        }
        if (minPrice !== null) {
            url += `minPrice=${minPrice}&`;
        }
        if (maxPrice !== null) {
            url += `maxPrice=${maxPrice}&`;
        }
        if (userLocation) {
            url += `lat=${userLocation.lat}&lng=${userLocation.lng}&radius=1000`;
        }
        fetch(url)
            .then((res) => res.json())
            .then(async (data) => {
                setAllItems(data);
                const withCoords = await mapItemsToCoords(data);
                setLocations(withCoords);
            });
    };

    const handleClearFilters = () => {
        const currentApiUrl = getApiUrl();
        let url = currentApiUrl;
        if (userLocation) {
            url += `?lat=${userLocation.lat}&lng=${userLocation.lng}&radius=1000`;
        }
        fetch(url)
            .then((res) => res.json())
            .then(async (data) => {
                setAllItems(data);
                const withCoords = await mapItemsToCoords(data);
                setLocations(withCoords);
            });
    };

    return (
<div className="map-wrapper" style={{
    width: '100vw',
    height: 'calc(100vh - 80px)',
    position: 'relative',
    marginTop: '80px'
}}>          
  {/* Filter Button: Always visible, fixed position, in front */}
            <div
                style={{
                    position: 'fixed',
                    top: 180, // adjust as needed
                    right: 4, // adjust as needed
                    zIndex: 1300, // higher than overlays and FAB
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <FilterButton onApplyFilters={handleFilter} categoryType={getCategoryType()} />
            </div>
            {view === "map" ? (
                <>
                    {/* Map fills the background */}
                    <MapView
                        locations={locations}
                        mapHeight={"100%"}
                        onBoundsChanged={setMapBounds}
                    />
                    {/* Overlay controls */}
                    <div className="map-overlay" style={{ position: 'absolute', top: 10, left: 0, width: '100%', zIndex: 10, pointerEvents: 'none' }}>
                        <div style={{ pointerEvents: 'auto', position: 'relative' }}>
                            <h1 className="text-xl font-bold text-center">{getDisplayTitle()}</h1>
                            <div className="w-full">
                                <span className="text-base font-semibold text-center block">
                                    {user ? `היי ${user.displayName || 'user'}` : 'hello guest'}
                                </span>
                            </div>
                            <div className="w-full flex flex-col gap-0 items-center">
                                <div className="w-full">
                                    <SearchBar
                                        searchQuery={searchQuery}
                                        setSearchQuery={setSearchQuery}
                                        onSearch={handleSearch}
                                        onClearFilters={handleClearFilters}
                                    />
                                </div>
                                <TabBar
                                    activeTab={contentType}
                                    onTabChange={setContentType}
                                    tabs={tabs}
                                />
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                // List view: controls at top, list fills rest
                <>
                    <div>
                        <h1 className="text-xl font-bold text-center">{getDisplayTitle()}</h1>
                        <div className="w-full">
                            <span className="text-base font-semibold text-center block">
                                {user ? `היי ${user.displayName || 'user'}` : 'hello guest'}
                            </span>
                        </div>
                        <div className="w-full flex flex-col gap-0 items-center">
                            <div className="w-full">
                                <SearchBar
                                    searchQuery={searchQuery}
                                    setSearchQuery={setSearchQuery}
                                    onSearch={handleSearch}
                                    onClearFilters={handleClearFilters}
                                />
                            </div>
                            <TabBar
                                activeTab={contentType}
                                onTabChange={setContentType}
                                tabs={tabs}
                            />
                        </div>
                        {/* Map/List controls below search and tabs, always visible */}
                        {/* FilterButton removed from here */}
                    </div>
                    <div style={{ flex: 1, position: 'relative', width: '100%' }}>
                        <div style={{ width: '100%', height: '100%', overflowY: 'auto', position: 'relative' }}>
                            <ListView rentals={allItems} />
                        </div>
                    </div>
                </>
            )}
            {/* ToggleViewButton: always visible, fixed, in front of everything */}
            <div style={{ position: 'fixed', bottom: 152, right: 0, zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ToggleViewButton view={view} setView={setView} />
            </div>
            {/* Add Listing/Request Button (FAB) */}
            {(contentType === 'rentals' || contentType === 'services' || contentType === 'rental_requests' || contentType === 'service_requests') && (
                <button
                    className="myitems-add-btn"
                    aria-label={
                        contentType === 'rentals' ? (i18n.language === 'he' ? t('rentals.add_rental') : 'Add Rental') :
                        contentType === 'services' ? (i18n.language === 'he' ? t('services.add_service') : 'Add Service') :
                        contentType === 'rental_requests' ? (i18n.language === 'he' ? t('rentals.request_rental') : 'Request Rental') :
                        (i18n.language === 'he' ? t('services.request_service') : 'Request Service')
                    }
                    title={
                        contentType === 'rentals' ? (i18n.language === 'he' ? t('rentals.add_rental') : 'Add Rental') :
                        contentType === 'services' ? (i18n.language === 'he' ? t('services.add_service') : 'Add Service') :
                        contentType === 'rental_requests' ? (i18n.language === 'he' ? t('rentals.request_rental') : 'Request Rental') :
                        (i18n.language === 'he' ? t('services.request_service') : 'Request Service')
                    }
                    style={{
                        position: 'fixed',
                        bottom: 90,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 1000,
                        width: 48,
                        height: 48,
                        padding: 0,
                        background: '#087E8B',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '50%',
                        fontFamily: 'Alef, Inter, sans-serif',
                        fontSize: 28,
                        cursor: 'pointer',
                        boxShadow: '0 4px 16px rgba(38, 166, 154, 0.18)',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'background 0.2s',
                    }}
                    onClick={() => {
                        if (contentType === 'rentals') navigate('/offer-rental');
                        else if (contentType === 'services') navigate('/offer-service');
                        else if (contentType === 'rental_requests') navigate('/request-rental');
                        else if (contentType === 'service_requests') navigate('/request-service');
                    }}
                    onMouseOver={e => e.currentTarget.style.background = '#009688'}
                    onMouseOut={e => e.currentTarget.style.background = '#2E4057'}
                >
                    <span style={{fontSize: 28, lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center'}} aria-hidden="true">+</span>
                </button>
            )}
        </div>
    );
};

export default GenericMapPage;