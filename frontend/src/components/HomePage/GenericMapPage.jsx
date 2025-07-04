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

const GenericMapPage = ({ title, apiUrl }) => {
    const [allItems, setAllItems] = useState([]);
    const [locations, setLocations] = useState([]);
    const [view, setView] = useState("map");
    const [contentType, setContentType] = useState(apiUrl.includes('/services') ? 'services' : 'rentals');
    const [searchQuery, setSearchQuery] = useState("");
    const [appliedFilters, setAppliedFilters] = useState({ categories: [], minPrice: null, maxPrice: null });
    const [userLocation, setUserLocation] = useState(null);
    const [resetSearchArea, setResetSearchArea] = useState(0);
    const [loading, setLoading] = useState(false);
    const [mapBounds, setMapBounds] = useState(null);
    const boundsTimeout = useRef(null);
    const lastFetchedBounds = useRef(null);
    const { t, i18n } = useTranslation();
    const { user } = useAuthContext();

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
        setLoading(true);
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
            setLoading(false);
        } catch {
            setAllItems([]);
            setLocations([]);
            setLoading(false);
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
        setResetSearchArea(prev => prev + 1);
    };

    const handleFilter = ({ categories, minPrice, maxPrice }) => {
        setAppliedFilters({ categories, minPrice, maxPrice });
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
                setResetSearchArea(prev => prev + 1);
            });
    };

    const handleClearFilters = () => {
        setAppliedFilters({ categories: [], minPrice: null, maxPrice: null });
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
                setResetSearchArea(prev => prev + 1);
            });
    };

    const handleRemoveCategory = (catToRemove) => {
        const updatedCategories = appliedFilters.categories.filter(cat => cat !== catToRemove);
        handleFilter({ categories: updatedCategories, minPrice: appliedFilters.minPrice, maxPrice: appliedFilters.maxPrice });
    };

    const handleRemovePrice = () => {
        handleFilter({ categories: appliedFilters.categories, minPrice: null, maxPrice: null });
    };

    const filterCount = appliedFilters.categories.length + (appliedFilters.minPrice !== null ? 1 : 0) + (appliedFilters.maxPrice !== null ? 1 : 0);

    const handleSearchInArea = (center) => {
        const currentApiUrl = getApiUrl();
        let url = `${currentApiUrl}?lat=${center.lat}&lng=${center.lng}&radius=1000`;
        fetch(url)
            .then((res) => res.json())
            .then(async (data) => {
                setAllItems(data);
                const withCoords = await mapItemsToCoords(data);
                setLocations(withCoords);
                setUserLocation(center);
                setResetSearchArea(prev => prev + 1);
            });
    };

    return (
        <div className="p-1 flex flex-col gap-0 items-center"> {/* Reduced padding and gap */}
            <h2 className="text-xl font-bold text-center">{getDisplayTitle()}</h2> {/* Reduced text size */}
            <div className={`w-full ${i18n.language === 'he' ? 'text-right' : 'text-left'}`}>
                <span className="text-base font-semibold">
                    {user ? `hello ${user.displayName || 'user'}` : 'hello guest'}
                </span>
            </div>

            <div className="w-full flex flex-col gap-0 items-center"> {/* Reduced gap */}
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

            {/* Active Filter Buttons */}
            {filterCount > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                    {appliedFilters.categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => handleRemoveCategory(cat)}
                            className="bg-blue-200 text-blue-800 font-medium px-3 py-2 rounded-full hover:bg-blue-200"
                        >
                            {cat} ✕
                        </button>
                    ))}
                    {appliedFilters.minPrice !== null && (
                        <button
                            onClick={handleRemovePrice}
                            className="bg-green-200 text-green-800 font-medium px-3 py-2 rounded-full hover:bg-green-200"
                        >
                            Min: {appliedFilters.minPrice}₪ ✕
                        </button>
                    )}
                    {appliedFilters.maxPrice !== null && (
                        <button
                            onClick={handleRemovePrice}
                            className="bg-green-200 text-green-800 font-medium px-3 py-2 rounded-full hover:bg-green-200"
                        >
                            Max: {appliedFilters.maxPrice}₪ ✕
                        </button>
                    )}
                </div>
            )}

            <div className="map-wrapper w-full mb-0 pb-0">
                {view === "map" ? (
                    <>
                        <MapView 
                            locations={locations} 
                            onApplyFilters={handleFilter}
                            categoryType={getCategoryType()}
                            view={view}
                            setView={setView}
                            onSearchInArea={handleSearchInArea}
                            mapHeight={600}
                            resetSearchArea={resetSearchArea}
                            loading={loading}
                            onBoundsChanged={setMapBounds}
                        />
                        <div style={{ height: '48px' }} />
                    </>
                ) : (
                    <>
                        <div style={{ position: 'absolute', top: 2, right: 2, zIndex: 8 }}>
                            <ToggleViewButton view={view} setView={setView} />
                        </div>
                        <div style={{ maxHeight: 600, overflowY: 'auto' }}>
                            <ListView rentals={allItems} />
                        </div>
                        <div style={{ height: '48px' }} />
                    </>
                )}
            </div>
        </div>
    );
};

export default GenericMapPage;