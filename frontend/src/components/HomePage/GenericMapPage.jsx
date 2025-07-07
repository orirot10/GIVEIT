import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
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
import logoBlue from '../../../images/logoBlue3.png';

// Loading Component
const LoadingSpinner = ({ message = "Loading..." }) => (
    <div className="loading-overlay" style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(255,255,255,0.8)',
        zIndex: 2000,
        backdropFilter: 'blur(2px)'
    }}>
        <div className="loading-content" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
            padding: 24,
            background: 'white',
            borderRadius: 12,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            maxWidth: 200,
            textAlign: 'center'
        }}>
            <div
                className="spinner"
                style={{
                    width: 40,
                    height: 40,
                    border: '4px solid #f0f0f0',
                    borderTop: '4px solid #087E8B',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }}
            />
            <span style={{
                color: '#087E8B',
                fontWeight: 500,
                fontSize: 14
            }}>
                {message}
            </span>
        </div>
    </div>
);

// Error Boundary Component
const ErrorFallback = ({ error, onRetry }) => (
    <div className="error-state" style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        padding: 24,
        background: 'white',
        borderRadius: 12,
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        maxWidth: 300,
        zIndex: 2000
    }}>
        <h3 style={{ color: '#d32f2f', marginBottom: 12 }}>Something went wrong</h3>
        <p style={{ color: '#666', marginBottom: 16, fontSize: 14 }}>
            {error || 'Unable to load items. Please try again.'}
        </p>
        <button
            onClick={onRetry}
            style={{
                background: '#087E8B',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: 6,
                cursor: 'pointer',
                fontWeight: 500
            }}
        >
            Try Again
        </button>
    </div>
);

// Empty State Component
const EmptyState = ({ contentType, searchQuery }) => {
    const { t } = useTranslation();
    
    const getMessage = () => {
        if (searchQuery) {
            return `No results found for "${searchQuery}"`;
        }
        switch (contentType) {
            case 'rentals':
                return t('No rental items available in this area');
            case 'services':
                return t('No services available in this area');
            case 'rental_requests':
                return t('No rental requests in this area');
            case 'service_requests':
                return t('No service requests in this area');
            default:
                return t('No items available in this area');
        }
    };

    return (
        <div className="empty-state" style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            padding: 24,
            zIndex: 1000
        }}>
            <div style={{
                fontSize: 48,
                marginBottom: 16,
                opacity: 0.3
            }}>
                📍
            </div>
            <p style={{
                color: '#666',
                fontSize: 16,
                marginBottom: 8
            }}>
                {getMessage()}
            </p>
            <p style={{
                color: '#999',
                fontSize: 14
            }}>
                Try adjusting your search or filters
            </p>
        </div>
    );
};

const GenericMapPage = ({ apiUrl }) => {
    const [allItems, setAllItems] = useState([]);
    const [locations, setLocations] = useState([]);
    const [view, setView] = useState("map");
    const [contentType, setContentType] = useState(apiUrl.includes('/services') ? 'services' : 'rentals');
    const [searchQuery, setSearchQuery] = useState("");
    const [userLocation, setUserLocation] = useState(null);
    const [mapBounds, setMapBounds] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasInitialLoad, setHasInitialLoad] = useState(false);
    
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

    // Memoized API URL function
    const getApiUrl = useCallback(() => {
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
    }, [contentType]);

    // Memoized category type function
    const getCategoryType = useCallback(() => {
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
    }, [contentType]);

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
                    setError('Unable to get your location. Using default area.');
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        }
    }, [userLocation]);

    // Debounced fetch for items within bounds
    useEffect(() => {
        if (!mapBounds) return;
        // Only fetch items within bounds if there is no active search
        if (searchQuery && searchQuery.trim() !== "") return;
        
        const boundsKey = JSON.stringify(mapBounds) + contentType;
        if (lastFetchedBounds.current === boundsKey) return;
        
        if (boundsTimeout.current) clearTimeout(boundsTimeout.current);
        
        boundsTimeout.current = setTimeout(() => {
            setLoading(true);
            setError(null);
            fetchItemsWithinBounds(mapBounds)
                .finally(() => {
                    setLoading(false);
                    setHasInitialLoad(true);
                });
            lastFetchedBounds.current = boundsKey;
        }, 800); // Reduced from 700ms for better responsiveness
        
        return () => {
            if (boundsTimeout.current) {
                clearTimeout(boundsTimeout.current);
            }
        };
    }, [mapBounds, contentType, searchQuery]);

    // Fetch items within bounds with error handling
    const fetchItemsWithinBounds = async (bounds) => {
        try {
            const currentApiUrl = getApiUrl();
            const { northEast, southWest } = bounds;
            const url = `${currentApiUrl}?minLat=${southWest.lat}&maxLat=${northEast.lat}&minLng=${southWest.lng}&maxLng=${northEast.lng}`;
            
            const res = await fetch(url);
            if (!res.ok) {
                throw new Error(`Failed to fetch items: ${res.status}`);
            }
            
            const items = await res.json();
            setAllItems(items);
            const withCoords = await mapItemsToCoords(items);
            setLocations(withCoords);
            setError(null);
        } catch (err) {
            console.error('Error fetching items:', err);
            setError(err.message);
            setAllItems([]);
            setLocations([]);
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

    const handleSearch = useCallback(() => {
        const currentApiUrl = getApiUrl();
        setLoading(true);
        setError(null);
        
        searchItems({ 
            apiUrl: currentApiUrl, 
            searchQuery, 
            setAllItems, 
            setLocations: async (items) => {
                const withCoords = await mapItemsToCoords(items);
                setLocations(withCoords);
            }
        }).finally(() => setLoading(false));
    }, [getApiUrl, searchQuery]);

    const handleFilter = useCallback(({ categories, minPrice, maxPrice }) => {
        const currentApiUrl = getApiUrl();
        setLoading(true);
        setError(null);
        
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
            .then((res) => {
                if (!res.ok) throw new Error('Failed to apply filters');
                return res.json();
            })
            .then(async (data) => {
                setAllItems(data);
                const withCoords = await mapItemsToCoords(data);
                setLocations(withCoords);
                setError(null);
            })
            .catch((err) => {
                console.error('Filter error:', err);
                setError('Failed to apply filters');
            })
            .finally(() => setLoading(false));
    }, [getApiUrl, userLocation]);

    const handleClearFilters = useCallback(() => {
        const currentApiUrl = getApiUrl();
        setLoading(true);
        setError(null);
        setSearchQuery(""); // <-- Clear the search query as well
        
        let url = currentApiUrl;
        if (userLocation) {
            url += `?lat=${userLocation.lat}&lng=${userLocation.lng}&radius=1000`;
        }
        
        fetch(url)
            .then((res) => {
                if (!res.ok) throw new Error('Failed to clear filters');
                return res.json();
            })
            .then(async (data) => {
                setAllItems(data);
                const withCoords = await mapItemsToCoords(data);
                setLocations(withCoords);
                setError(null);
            })
            .catch((err) => {
                console.error('Clear filters error:', err);
                setError('Failed to clear filters');
            })
            .finally(() => setLoading(false));
    }, [getApiUrl, userLocation, setSearchQuery]);

    const handleRetry = useCallback(() => {
        setError(null);
        if (mapBounds) {
            fetchItemsWithinBounds(mapBounds);
        }
    }, [mapBounds]);

    // Memoized header content
    const headerContent = useMemo(() => (
        <div className="app-header" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 0,
            padding: '0px 8px 0px',
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(10px)',
            borderBottom: '0px solid rgba(0,0,0,0.1)'
        }}>
                        <span style={{
                fontSize: 18,
                fontWeight: 600,
                color: '#087E8B'
            }}>
                {user ? `היי ${user.displayName || 'user'}` : 'hello guest'}
            </span>

            <img src={logoBlue} alt="Givit Logo" style={{
               width: 180,
               height: 150,
            }} />

        </div>
    ), [user]);

    // Show empty state when appropriate
    const shouldShowEmptyState = hasInitialLoad && !loading && allItems.length === 0 && !error;

    return (
        <div className="map-wrapper" style={{
            width: '100vw',
            height: 'calc(100vh - 80px)',
            position: 'relative',
            marginTop: '0px',
            background: '#f5f5f5'
        }}>
            {/* Add CSS animation for spinner */}
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                .app-header {
                    transition: all 0.3s ease;
                }
                .myitems-add-btn {
                    transition: all 0.2s ease;
                }
                .myitems-add-btn:hover {
                    transform: translateX(-50%) scale(1.05);
                }
                .myitems-add-btn:active {
                    transform: translateX(-50%) scale(0.95);
                }
            `}</style>

            {/* Loading Overlay */}
            {loading && <LoadingSpinner message="Loading nearby items..." />}

            {/* Error State */}
            {error && !loading && (
                <ErrorFallback error={error} onRetry={handleRetry} />
            )}

            {/* Empty State */}
            {shouldShowEmptyState && (
                <EmptyState contentType={contentType} searchQuery={searchQuery} />
            )}

            {/* Filter Button: Always visible, fixed position */}
            <div style={{
                position: 'fixed',
                top: 250,
                right: 16,
                zIndex: 1300,
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
            }}>
                <FilterButton 
                    onApplyFilters={handleFilter} 
                    categoryType={getCategoryType()} 
                />
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
                    <div className="map-overlay" style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        zIndex: 10,
                        pointerEvents: 'none'
                    }}>
                        <div style={{ pointerEvents: 'auto' }}>
                            {headerContent}
                            <div className="controls-container" style={{
                                padding: '2px 8px 0px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 0
                            }}>
                                <SearchBar
                                    searchQuery={searchQuery}
                                    setSearchQuery={setSearchQuery}
                                    onSearch={handleSearch}
                                    onClearFilters={handleClearFilters}
                                />
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
                /* List view */
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%'
                }}>
                    {headerContent}
                    <div className="controls-container" style={{
                        padding: '2px 8px 4px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 0,
                        background: 'white',
                        borderBottom: '1px solid rgba(0,0,0,0.1)'
                    }}>
                        <SearchBar
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            onSearch={handleSearch}
                            onClearFilters={handleClearFilters}
                        />
                        <TabBar
                            activeTab={contentType}
                            onTabChange={setContentType}
                            tabs={tabs}
                        />
                    </div>
                    <div style={{
                        flex: 1,
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            width: '100%',
                            height: '100%',
                            overflowY: 'auto',
                            position: 'relative'
                        }}>
                            <ListView rentals={allItems} />
                        </div>
                    </div>
                </div>
            )}

            {/* ToggleViewButton: always visible, fixed */}
            <div style={{
                position: 'fixed',
                bottom: 152,
                right: 16,
                zIndex: 1200,
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
            }}>
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
                    onClick={() => {
                        if (contentType === 'rentals') navigate('/offer-rental');
                        else if (contentType === 'services') navigate('/offer-service');
                        else if (contentType === 'rental_requests') navigate('/request-rental');
                        else if (contentType === 'service_requests') navigate('/request-service');
                    }}
                    onMouseOver={e => {
                        e.currentTarget.style.background = '#009688';
                        e.currentTarget.style.transform = 'translateX(-50%) scale(1.05)';
                    }}
                    onMouseOut={e => {
                        e.currentTarget.style.background = '#087E8B';
                        e.currentTarget.style.transform = 'translateX(-50%) scale(1)';
                    }}
                >
                    <span style={{
                        fontSize: 24,
                        lineHeight: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        +
                    </span>
                </button>
            )}
        </div>
    );
};

export default GenericMapPage;