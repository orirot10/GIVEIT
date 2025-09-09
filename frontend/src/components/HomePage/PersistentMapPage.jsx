import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import FilterButton from './FilterButton';
import TabBar from "./TabBar";
import SearchBar from "./SearchBar";
import '../../styles/HomePage/GenericMapPage.css';
import { handleSearch as searchItems } from "./searchHelpers";
import { useTranslation } from 'react-i18next';
import {
    getRentalCategoryFilterTags,
    getServiceCategoryFilterTags,
    getRentalSubcategoryFilterTags,
    getServiceSubcategoryFilterTags
} from "../../constants/categories";
import { useNavigate } from 'react-router-dom';
import { useMapContext } from '../../context/MapContext';

const BOUNCE_TIMEOUT = 300;
const DEFAULT_RADIUS = 1000;

const PersistentMapPage = ({ apiUrl }) => {
    const [allItems, setAllItems] = useState([]);
    const { 
        locations, 
        setLocations, 
        contentType, 
        setContentType,
        mapBounds,
        setMapBounds,
        userLocation,
        setUserLocation,
        isMapLoaded,
        setIsMapLoaded
    } = useMapContext();
    
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasInitialLoad, setHasInitialLoad] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSubcategory, setSelectedSubcategory] = useState('');

    const boundsTimeout = useRef(null);
    const lastFetchedBounds = useRef(null);
    const cacheRef = useRef(new Map());
    const abortControllerRef = useRef(null);
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();

    // Set content type based on URL
    useEffect(() => {
        const newContentType = apiUrl.includes('/services') ? 'services' : 'rentals';
        if (contentType !== newContentType) {
            setContentType(newContentType);
        }
    }, [apiUrl, contentType, setContentType]);

    // Memoized base URL with fallback to deployed backend
    const baseUrl = useMemo(
        () => import.meta.env.VITE_API_URL || 'https://giveit-backend.onrender.com',
        []
    );

    // Memoized API URL function
    const getApiUrl = useCallback(() => {
        const urlMap = {
            rentals: `${baseUrl}/api/rentals`,
            services: `${baseUrl}/api/services`,
            rental_requests: `${baseUrl}/api/rental_requests`,
            service_requests: `${baseUrl}/api/service_requests`
        };
        return urlMap[contentType] || `${baseUrl}/api/rentals`;
    }, [contentType, baseUrl]);

    // Memoized item mapping function
    const mapItemsToCoords = useCallback((items) => {
        return items
            .map(item => {
                const lat = item.lat ?? item.location?.coordinates?.[1];
                const lng = item.lng ?? item.location?.coordinates?.[0];
                return {
                    ...item,
                    lat,
                    lng,
                    id: item._id || item.id,
                    type: contentType
                };
            })
            .filter(item => typeof item.lat === 'number' && typeof item.lng === 'number');
    }, [contentType]);

    // Define tabs based on contentType and language
    const tabs = useMemo(() => {
        const tabConfigs = {
            rental: [
                { id: 'rental_requests', label: i18n.language === 'he' ? t('Wanted Products') : 'Wanted Products' },
                { id: 'rentals', label: i18n.language === 'he' ? t('Available Products') : 'Available Products' }
            ],
            service: [
                { id: 'service_requests', label: i18n.language === 'he' ? t('Wanted Services') : 'Wanted Services' },
                { id: 'services', label: i18n.language === 'he' ? t('Available Services') : 'Available Services' }
            ]
        };
        return tabConfigs[contentType.includes('rental') ? 'rental' : 'service'];
    }, [contentType, i18n.language, t]);

    // Fetch items within bounds with error handling (with cache)
    const fetchItemsWithinBounds = useCallback(async (bounds) => {
        try {
            const currentApiUrl = getApiUrl();
            const { northEast, southWest } = bounds;
            const boundsKey =
                JSON.stringify(bounds) + contentType + (selectedCategory || '') + (selectedSubcategory || '');
            const storageKey = `mapCache_${boundsKey}`;

            if (cacheRef.current.has(boundsKey)) {
                const cached = cacheRef.current.get(boundsKey);
                setAllItems(cached);
                const withCoords = mapItemsToCoords(cached);
                setLocations(withCoords);
                setError(null);
                return;
            }

            const sessionCached = sessionStorage.getItem(storageKey);
            if (sessionCached) {
                const parsed = JSON.parse(sessionCached);
                cacheRef.current.set(boundsKey, parsed);
                setAllItems(parsed);
                const withCoords = mapItemsToCoords(parsed);
                setLocations(withCoords);
                setError(null);
                return;
            }

            const url = `${currentApiUrl}?minLat=${southWest.lat}&maxLat=${northEast.lat}&minLng=${southWest.lng}&maxLng=${northEast.lng}`;

            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            abortControllerRef.current = new AbortController();
            const res = await fetch(url, { signal: abortControllerRef.current.signal });
            if (!res.ok) {
                throw new Error(`Failed to fetch items: ${res.status}`);
            }

            const items = await res.json();
            cacheRef.current.set(boundsKey, items);
            sessionStorage.setItem(storageKey, JSON.stringify(items));
            setAllItems(items);
            const withCoords = mapItemsToCoords(items);
            setLocations(withCoords);
            setError(null);
        } catch (err) {
            if (err.name === 'AbortError') return;
            console.error('Error fetching items:', err);
            setError(err.message);
            setAllItems([]);
            setLocations([]);
        } finally {
            abortControllerRef.current = null;
        }
    }, [getApiUrl, mapItemsToCoords, contentType, selectedCategory, selectedSubcategory, setLocations]);

    // Get user location on mount
    useEffect(() => {
        if (userLocation || !navigator.geolocation) return;
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setUserLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
            },
            (error) => {
                console.error('Error getting user location:', error);
                setError('Unable to get your location. Using default area.');
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    }, [userLocation, setUserLocation]);

    // Initial data fetch when component mounts or contentType changes
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const currentApiUrl = getApiUrl();
                let url = currentApiUrl;
                
                // If we have user location, fetch data around that location
                if (userLocation) {
                    const params = new URLSearchParams();
                    params.append('lat', userLocation.lat);
                    params.append('lng', userLocation.lng);
                    params.append('radius', DEFAULT_RADIUS);
                    url = `${currentApiUrl}?${params.toString()}`;
                } else {
                    // Fallback: fetch data from a default area (Tel Aviv area)
                    const defaultLat = 32.0853;
                    const defaultLng = 34.7818;
                    const params = new URLSearchParams();
                    params.append('lat', defaultLat);
                    params.append('lng', defaultLng);
                    params.append('radius', DEFAULT_RADIUS * 2);
                    url = `${currentApiUrl}?${params.toString()}`;
                }
                
                const res = await fetch(url);
                
                if (!res.ok) {
                    throw new Error(`Failed to fetch initial data: ${res.status}`);
                }
                
                const items = await res.json();
                
                setAllItems(items);
                const withCoords = mapItemsToCoords(items);
                setLocations(withCoords);
                setError(null);
                setHasInitialLoad(true);
                setIsMapLoaded(true);
                
            } catch (err) {
                console.error('Error fetching initial data:', err);
                setError(err.message);
                setAllItems([]);
                setLocations([]);
                setHasInitialLoad(true);
            } finally {
                setLoading(false);
            }
        };

        // Only fetch if map isn't already loaded with data
        if (!isMapLoaded || locations.length === 0) {
            fetchInitialData();
        }
    }, [contentType, userLocation, getApiUrl, mapItemsToCoords, isMapLoaded, locations.length, setLocations, setIsMapLoaded]);

    // Controls Component
    const Controls = React.memo(({ 
        searchQuery, 
        setSearchQuery, 
        onSearch, 
        onClearFilters, 
        contentType, 
        setContentType, 
        tabs,
        onAddListing,
        onMessages
    }) => {
        const [showSearchBar, setShowSearchBar] = useState(false);

        const openSearchBar = () => setShowSearchBar(true);

        const handleCloseSearch = () => {
            setShowSearchBar(false);
            setSearchQuery("");
            setSelectedCategory('');
            setSelectedSubcategory('');
            onClearFilters();
        };

        return (
            <div className="controls-container" style={{
                position: 'relative',
                padding: '12px 8px 0px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                alignItems: 'flex-start',
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(10px)'
            }}>
                <div className="search-toggle-container" style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '0 8px'
                }}>
                    {!showSearchBar && (
                        <button
                            onClick={openSearchBar}
                            className="search-button"
                            style={{
                                background: 'transparent',
                                color: '#000000',
                                border: 'none',
                                borderRadius: '50%',
                                width: '40px',
                                height: '40px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                            aria-label="Search"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="11" cy="11" r="8"></circle>
                                <path d="m21 21-4.35-4.35"></path>
                            </svg>
                        </button>
                    )}
                    <button
                        onClick={onAddListing}
                        className="add-listing-button"
                        style={{
                            background: 'transparent',
                            color: '#000000',
                            border: 'none',
                            borderRadius: '50%',
                            width: '40px',
                            height: '40px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        aria-label="Add Listing"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                    </button>
                    <button
                        onClick={onMessages}
                        className="messages-button"
                        style={{
                            background: 'transparent',
                            color: '#000000',
                            border: 'none',
                            borderRadius: '50%',
                            width: '40px',
                            height: '40px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        aria-label="Messages"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                    </button>
                </div>
                <div className={`search-bar-wrapper ${showSearchBar ? 'open' : ''}`}>
                    <SearchBar
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        onSearch={onSearch}
                        onClose={handleCloseSearch}
                        onClear={onClearFilters}
                    />
                </div>
                <TabBar
                    activeTab={contentType}
                    onTabChange={setContentType}
                    tabs={tabs}
                />
            </div>
        );
    });

    // Add listing handler
    const handleAddListing = useCallback(() => {
        const routeMap = {
            rentals: '/offer-rental',
            services: '/offer-service',
            rental_requests: '/request-rental',
            service_requests: '/request-service'
        };
        const route = routeMap[contentType];
        if (route) {
            navigate(route);
        }
    }, [contentType, navigate]);

    // Messages handler
    const handleMessages = useCallback(() => {
        navigate('/messages');
    }, [navigate]);

    // Search handler
    const handleSearch = useCallback(() => {
        const currentApiUrl = getApiUrl();
        setLoading(true);
        setError(null);
        
        searchItems({
            apiUrl: currentApiUrl,
            searchQuery,
            category: selectedCategory,
            subcategory: selectedSubcategory,
            setAllItems,
            setLocations: (items) => {
                const withCoords = mapItemsToCoords(items);
                setLocations(withCoords);
            }
        }).finally(() => setLoading(false));
    }, [getApiUrl, searchQuery, selectedCategory, selectedSubcategory, mapItemsToCoords, setLocations]);

    // Clear filters handler
    const handleClearFilters = useCallback(() => {
        const currentApiUrl = getApiUrl();
        setLoading(true);
        setError(null);
        setSearchQuery("");
        
        const params = new URLSearchParams();
        if (userLocation) {
            params.append('lat', userLocation.lat);
            params.append('lng', userLocation.lng);
            params.append('radius', DEFAULT_RADIUS);
        }
        
        const url = params.toString() ? `${currentApiUrl}?${params.toString()}` : currentApiUrl;
        
        fetch(url)
            .then((res) => {
                if (!res.ok) throw new Error('Failed to clear filters');
                return res.json();
            })
            .then((data) => {
                setAllItems(data);
                const withCoords = mapItemsToCoords(data);
                setLocations(withCoords);
                setError(null);
            })
            .catch((err) => {
                console.error('Clear filters error:', err);
                setError('Failed to clear filters');
            })
            .finally(() => setLoading(false));
    }, [getApiUrl, userLocation, mapItemsToCoords, setLocations]);

    // Get available categories and subcategories based on contentType
    const availableCategories = useMemo(() => {
        return contentType.includes('rental')
            ? getRentalCategoryFilterTags(i18n.language)
            : getServiceCategoryFilterTags(i18n.language);
    }, [contentType, i18n.language]);

    const availableSubcategories = useMemo(() => {
        if (!selectedCategory) return [];
        return contentType.includes('rental')
            ? getRentalSubcategoryFilterTags(selectedCategory, i18n.language)
            : getServiceSubcategoryFilterTags(selectedCategory, i18n.language);
    }, [selectedCategory, contentType, i18n.language]);

    // Category and subcategory click handlers
    const handleCategoryLabelClick = (cat) => {
        if (selectedCategory === cat) {
            setSelectedCategory('');
            setSelectedSubcategory('');
        } else {
            setSelectedCategory(cat);
            setSelectedSubcategory('');
        }
    };

    const handleSubcategoryLabelClick = (sub) => {
        setSelectedSubcategory(selectedSubcategory === sub ? '' : sub);
    };

    return (
        <div className="map-wrapper" style={{
            width: '100vw',
            height: 'calc(100vh - 80px)',
            position: 'relative',
            marginTop: '0px',
            background: 'transparent',
            pointerEvents: 'auto'
        }}>
            {/* CSS Animations */}
            <style>{`
                .search-bar-wrapper {
                    width: 100%;
                    max-height: 0;
                    overflow: hidden;
                    opacity: 0;
                    transform: translateY(-20px);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                
                .search-bar-wrapper.open {
                    max-height: 80px;
                    opacity: 1;
                    transform: translateY(0);
                }
                
                .floating-category-labels {
                    display: flex;
                    flex-wrap: nowrap;
                    overflow-x: auto;
                    justify-content: flex-start;
                    gap: 8px;
                    margin: 0px 0 0 0;
                    padding: 0 8px 2px 4px;
                    scrollbar-width: none;
                    -ms-overflow-style: none;
                    background: transparent;
                }
                .floating-category-labels::-webkit-scrollbar {
                    display: none;
                }
                .category-label {
                    background: #fff;
                    border: 1px solid #cbd5e1;
                    color: #334155;
                    border-radius: 16px;
                    padding: 4px 16px;
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    white-space: nowrap;
                    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
                }
                .category-label.selected, .category-label:hover {
                    background: #14b8a6;
                    color: #fff;
                    border-color: #14b8a6;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
                }
            `}</style>

            {/* Overlay controls at the top */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                zIndex: 20,
                pointerEvents: 'none',
            }}>
                <div style={{ pointerEvents: 'auto' }}>
                    <Controls
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        onSearch={handleSearch}
                        onClearFilters={handleClearFilters}
                        contentType={contentType}
                        setContentType={setContentType}
                        tabs={tabs}
                        onAddListing={handleAddListing}
                        onMessages={handleMessages}
                    />
                    <div className="floating-category-labels">
                        {availableCategories.map((cat) => (
                            <span
                                key={cat.value}
                                className={`category-label${selectedCategory === cat.value ? ' selected' : ''}`}
                                onClick={() => handleCategoryLabelClick(cat.value)}
                            >
                                {cat.label}
                            </span>
                        ))}
                    </div>
                    {selectedCategory && (
                        <div className="floating-category-labels">
                            {availableSubcategories.map((sub) => (
                                <span
                                    key={sub.value}
                                    className={`category-label${selectedSubcategory === sub.value ? ' selected' : ''}`}
                                    onClick={() => handleSubcategoryLabelClick(sub.value)}
                                >
                                    {sub.label}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* FAB */}
            <button
                className="myitems-add-btn"
                style={{
                    position: 'fixed',
                    bottom: 90,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 1000,
                    width: 56,
                    height: 56,
                    padding: 0,
                    background: '#087E8B',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '50%',
                    fontSize: 24,
                    cursor: 'pointer',
                    boxShadow: '0 6px 20px rgba(8, 126, 139, 0.3)',
                    fontWeight: 400,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease'
                }}
                onClick={handleAddListing}
            >
                +
            </button>
        </div>
    );
};

export default PersistentMapPage;