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
import { useNavigate } from 'react-router-dom';
import logoBlue from '../../../images/logoBlue3.png';

// Constants
const BOUNCE_TIMEOUT = 800;
const LOCATION_TIMEOUT = 10000;
const DEFAULT_RADIUS = 1000;

// Loading Component
const LoadingSpinner = React.memo(({ message = "Loading..." }) => (
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
));

// Error Boundary Component
const ErrorFallback = React.memo(({ error, onRetry }) => (
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
));

// Empty State Component
const EmptyState = React.memo(({ contentType, searchQuery }) => {
    const { t } = useTranslation();
    
    const message = useMemo(() => {
        if (searchQuery) {
            return `No results found for "${searchQuery}"`;
        }
        const messageMap = {
            rentals: t('נסה להגדיל את האזור'),
            services: t('נסה להגדיל את האזור'),
            rental_requests: t('נסה להגדיל את האזור'),
            service_requests: t('נסה להגדיל את האזור')
        };
        return messageMap[contentType] || t('No items available in this area');
    }, [contentType, searchQuery, t]);

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
                {message}
            </p>
            <p style={{
                color: '#999',
                fontSize: 14
            }}>
                Try adjusting your search or filters
            </p>
        </div>
    );
});

// Header Component
const Header = React.memo(({ user }) => (
    <div className="app-header" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 0,
        padding: '0px 0px 0px', // reduced padding
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '0px solid rgba(0,0,0,0.1)',
        minHeight: 0, // set a minimum height for compactness
        height: 0
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
));

// Controls Component
const Controls = React.memo(({ 
    searchQuery, 
    setSearchQuery, 
    onSearch, 
    onClearFilters, 
    contentType, 
    setContentType, 
    tabs 
}) => (
    <div className="controls-container" style={{
        padding: '12px 8px 0px',
        display: 'flex',
        flexDirection: 'column',
        gap: 5
    }}>
        <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSearch={onSearch}
            onClearFilters={onClearFilters}
        />
        <TabBar
            activeTab={contentType}
            onTabChange={setContentType}
            tabs={tabs}
        />
    </div>
));

// FAB Component
const FloatingActionButton = React.memo(({ contentType, navigate, t, i18n }) => {
    const buttonConfig = useMemo(() => {
        const configs = {
            rentals: {
                label: i18n.language === 'he' ? t('rentals.add_rental') : 'Add Rental',
                route: '/offer-rental'
            },
            services: {
                label: i18n.language === 'he' ? t('services.add_service') : 'Add Service',
                route: '/offer-service'
            },
            rental_requests: {
                label: i18n.language === 'he' ? t('rentals.request_rental') : 'Request Rental',
                route: '/request-rental'
            },
            service_requests: {
                label: i18n.language === 'he' ? t('services.request_service') : 'Request Service',
                route: '/request-service'
            }
        };
        return configs[contentType];
    }, [contentType, i18n.language, t]);

    const handleClick = useCallback(() => {
        if (buttonConfig?.route) {
            navigate(buttonConfig.route);
        }
    }, [buttonConfig, navigate]);

    if (!buttonConfig) return null;

    return (
        <button
            className="myitems-add-btn"
            aria-label={buttonConfig.label}
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
            onClick={handleClick}
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
    );
});

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
    const [selectedCategory, setSelectedCategory] = useState(null);
    
    const boundsTimeout = useRef(null);
    const lastFetchedBounds = useRef(null);
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();

    // Memoized base URL
    const baseUrl = useMemo(() => import.meta.env.VITE_API_URL, []);

    // Define tabs based on contentType and language
    const tabs = useMemo(() => {
        const tabConfigs = {
            rental: [
                { id: 'rentals', label: i18n.language === 'he' ? t('Available Products') : 'Available Products' },
                { id: 'rental_requests', label: i18n.language === 'he' ? t('Wanted Products') : 'Wanted Products' }
            ],
            service: [
                { id: 'services', label: i18n.language === 'he' ? t('Available Services') : 'Available Services' },
                { id: 'service_requests', label: i18n.language === 'he' ? t('Wanted Services') : 'Wanted Services' }
            ]
        };
        return tabConfigs[contentType.includes('rental') ? 'rental' : 'service'];
    }, [contentType, i18n.language, t]);

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
            .filter(item => typeof item.lat === 'number' && typeof item.lng === 'number')
            .map(item => ({
                ...item,
                id: item._id || item.id,
                type: contentType
            }));
    }, [contentType]);

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
            { enableHighAccuracy: true, timeout: LOCATION_TIMEOUT, maximumAge: 0 }
        );
    }, [userLocation]);

    // Fetch items within bounds with error handling
    const fetchItemsWithinBounds = useCallback(async (bounds) => {
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
            const withCoords = mapItemsToCoords(items);
            setLocations(withCoords);
            setError(null);
        } catch (err) {
            console.error('Error fetching items:', err);
            setError(err.message);
            setAllItems([]);
            setLocations([]);
        }
    }, [getApiUrl, mapItemsToCoords]);

    // Debounced fetch for items within bounds
    useEffect(() => {
        if (!mapBounds || (searchQuery && searchQuery.trim() !== "")) return;

        const boundsKey = JSON.stringify(mapBounds) + contentType + (selectedCategory || '');
        if (lastFetchedBounds.current === boundsKey) return;

        if (boundsTimeout.current) clearTimeout(boundsTimeout.current);

        boundsTimeout.current = setTimeout(() => {
            setLoading(true);
            setError(null);
            if (selectedCategory) {
                // If a category filter is active, apply it to the new bounds
                const currentApiUrl = getApiUrl();
                const { northEast, southWest } = mapBounds;
                const params = new URLSearchParams();
                params.append('category', selectedCategory);
                params.append('minLat', southWest.lat);
                params.append('maxLat', northEast.lat);
                params.append('minLng', southWest.lng);
                params.append('maxLng', northEast.lng);
                const url = `${currentApiUrl}/filter?${params.toString()}`;
                fetch(url)
                    .then((res) => {
                        if (!res.ok) throw new Error('Failed to apply filters');
                        return res.json();
                    })
                    .then((data) => {
                        setAllItems(data);
                        const withCoords = mapItemsToCoords(data);
                        setLocations(withCoords);
                        setError(null);
                    })
                    .catch((err) => {
                        console.error('Filter error:', err);
                        setError('Failed to apply filters');
                    })
                    .finally(() => {
                        setLoading(false);
                        setHasInitialLoad(true);
                    });
            } else {
                fetchItemsWithinBounds(mapBounds)
                    .finally(() => {
                        setLoading(false);
                        setHasInitialLoad(true);
                    });
            }
            lastFetchedBounds.current = boundsKey;
        }, BOUNCE_TIMEOUT);

        return () => {
            if (boundsTimeout.current) {
                clearTimeout(boundsTimeout.current);
            }
        };
    }, [mapBounds, contentType, searchQuery, fetchItemsWithinBounds, selectedCategory, getApiUrl, mapItemsToCoords]);

    // Search handler
    const handleSearch = useCallback(() => {
        const currentApiUrl = getApiUrl();
        setLoading(true);
        setError(null);
        
        searchItems({ 
            apiUrl: currentApiUrl, 
            searchQuery, 
            setAllItems, 
            setLocations: (items) => {
                const withCoords = mapItemsToCoords(items);
                setLocations(withCoords);
            }
        }).finally(() => setLoading(false));
    }, [getApiUrl, searchQuery, mapItemsToCoords]);

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
    }, [getApiUrl, userLocation, mapItemsToCoords]);

    // Retry handler
    const handleRetry = useCallback(() => {
        setError(null);
        if (mapBounds) {
            fetchItemsWithinBounds(mapBounds);
        }
    }, [mapBounds, fetchItemsWithinBounds]);

    // Show empty state when appropriate
    const shouldShowEmptyState = hasInitialLoad && !loading && allItems.length === 0 && !error;

    // Get available categories based on contentType
    const availableCategories = useMemo(() => {
        return contentType.includes('rental') ?
            [
                'Tools',
                'Electronics',
                'Vehicles',
                'Sports',
                'Furniture',
                'Clothes',
                'Other',
            ] : [
                'Repair',
                'Cleaning',
                'Tutoring',
                'Moving',
                'Pet Care',
                'Beauty',
                'Other',
            ];
    }, [contentType]);

    // Get translated label for each category
    const getCategoryLabel = (cat) => {
        if (i18n.language === 'he') {
            if (contentType.includes('rental')) {
                return t(`categories.rental.${cat}`);
            } else {
                return t(`categories.service.${cat}`);
            }
        }
        return cat;
    };

    // Category label click handler
    const handleCategoryLabelClick = (cat) => {
        if (selectedCategory === cat) {
            setSelectedCategory(null);
            handleClearFilters();
        } else {
            setSelectedCategory(cat);
            // Filter by category only
            const currentApiUrl = getApiUrl();
            setLoading(true);
            setError(null);
            const params = new URLSearchParams();
            params.append('category', cat);
            if (userLocation) {
                params.append('lat', userLocation.lat);
                params.append('lng', userLocation.lng);
                params.append('radius', DEFAULT_RADIUS);
            }
            const url = `${currentApiUrl}/filter?${params.toString()}`;
            fetch(url)
                .then((res) => {
                    if (!res.ok) throw new Error('Failed to apply filters');
                    return res.json();
                })
                .then((data) => {
                    setAllItems(data);
                    const withCoords = mapItemsToCoords(data);
                    setLocations(withCoords);
                    setError(null);
                })
                .catch((err) => {
                    console.error('Filter error:', err);
                    setError('Failed to apply filters');
                })
                .finally(() => setLoading(false));
        }
    };

    return (
        <div className="map-wrapper" style={{
            width: '100vw',
            height: 'calc(100vh - 80px)',
            position: 'relative',
            marginTop: '0px',
            background: '#f5f5f5'
        }}>
            {/* CSS Animations */}
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
                .floating-category-labels {
                    display: flex;
                    flex-wrap: nowrap;
                    overflow-x: auto;
                    justify-content: flex-start;
                    gap: 8px;
                    margin: 0px 0 0 0;
                    padding: 0 8px 2px 4px;
                    scrollbar-width: none; /* Firefox */
                    -ms-overflow-style: none;  /* IE 10+ */
                    background: transparent;
                }
                .floating-category-labels::-webkit-scrollbar {
                    display: none; /* Chrome/Safari/Webkit */
                }
                .category-label {
                    background: #fff;
                    border: 1px solidrgb(225, 233, 234);
                    color: #087E8B;
                    border-radius: 16px;
                    padding: 4px 16px;
                    font-size: 15px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: background 0.2s, color 0.2s;
                    white-space: nowrap;
                }
                .category-label.selected, .category-label:hover {
                    background: #087E8B;
                    color: #fff;
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

            {/* Filter Button */}
            {/*
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
            */}

            {view === "map" ? (
                <>
                    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                        <MapView
                            locations={locations}
                            mapHeight={"100%"}
                            onBoundsChanged={setMapBounds}
                        />
                        {/* Overlay controls and labels at the top of the map */}
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            zIndex: 20,
                            pointerEvents: 'none',
                        }}>
                            <div style={{ pointerEvents: 'auto' }}>
                                {/* Header removed */}
                                <div style={{ position: 'relative' }}>
                                    <Controls
                                        searchQuery={searchQuery}
                                        setSearchQuery={setSearchQuery}
                                        onSearch={handleSearch}
                                        onClearFilters={handleClearFilters}
                                        contentType={contentType}
                                        setContentType={setContentType}
                                        tabs={tabs}
                                    />
                                    <div className="floating-category-labels">
                                        {availableCategories.map((cat) => (
                                            <span
                                                key={cat}
                                                className={`category-label${selectedCategory === cat ? ' selected' : ''}`}
                                                onClick={() => handleCategoryLabelClick(cat)}
                                            >
                                                {getCategoryLabel(cat)}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%'
                }}>
                    {/* Header removed */}
                    <div className="controls-container" style={{
                        padding: '2px 8px 4px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 0,
                        background: 'white',
                        borderBottom: '1px solid rgba(0,0,0,0.1)'
                    }}>
                        <Controls
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            onSearch={handleSearch}
                            onClearFilters={handleClearFilters}
                            contentType={contentType}
                            setContentType={setContentType}
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

            {/* Toggle View Button */}
            <div style={{
                position: 'fixed',
                bottom: 152,
                right: 16,
                zIndex: 1200,
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
            }}>
                <ToggleViewButton view={view} setView={setView} />
            </div>

            {/* Floating Action Button */}
            <FloatingActionButton 
                contentType={contentType}
                navigate={navigate}
                t={t}
                i18n={i18n}
            />
        </div>
    );
};2

export default GenericMapPage;