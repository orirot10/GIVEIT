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

// Design System - Unified Color Palette & Typography
const DESIGN_TOKENS = {
    // Primary Color Palette (Teal-based)
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
    // Typography System
    typography: {
        fontFamily: {
            primary: "'Assistant', 'David Libre', Arial, sans-serif",
            secondary: "'Inter', 'Alef', Arial, sans-serif"
        },
        fontSize: {
            xs: '12px',
            sm: '14px',
            base: '16px',
            lg: '18px',
            xl: '20px',
            '2xl': '24px',
            '3xl': '30px'
        },
        fontWeight: {
            normal: 400,
            medium: 500,
            semibold: 600,
            bold: 700
        }
    },
    // Spacing System
    spacing: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        '2xl': '32px',
        '3xl': '48px'
    },
    // Border Radius
    borderRadius: {
        sm: '6px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        full: '9999px'
    },
    // Shadows
    shadows: {
        sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px rgba(0, 0, 0, 0.07)',
        lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
        xl: '0 20px 25px rgba(0, 0, 0, 0.15)'
    }
};

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
        background: 'rgba(255,255,255,0.9)',
        zIndex: 2000,
        backdropFilter: 'blur(4px)',
        fontFamily: DESIGN_TOKENS.typography.fontFamily.primary
    }}>
        <div className="loading-content" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: DESIGN_TOKENS.spacing.lg,
            padding: DESIGN_TOKENS.spacing.xl,
            background: 'white',
            borderRadius: DESIGN_TOKENS.borderRadius.lg,
            boxShadow: DESIGN_TOKENS.shadows.xl,
            maxWidth: 240,
            textAlign: 'center'
        }}>
            <div
                className="spinner"
                style={{
                    width: 48,
                    height: 48,
                    border: `4px solid ${DESIGN_TOKENS.colors.neutral[200]}`,
                    borderTop: `4px solid ${DESIGN_TOKENS.colors.primary[500]}`,
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }}
            />
            <span style={{
                color: DESIGN_TOKENS.colors.primary[600],
                fontWeight: DESIGN_TOKENS.typography.fontWeight.medium,
                fontSize: DESIGN_TOKENS.typography.fontSize.sm,
                fontFamily: DESIGN_TOKENS.typography.fontFamily.primary
            }}>
                {message}
            </span>
        </div>
    </div>
));

// Error Boundary Component

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
            padding: DESIGN_TOKENS.spacing.xl,
            zIndex: 1000,
            fontFamily: DESIGN_TOKENS.typography.fontFamily.primary
        }}>
            <div style={{
                fontSize: 56,
                marginBottom: DESIGN_TOKENS.spacing.lg,
                opacity: 0.4,
                color: DESIGN_TOKENS.colors.neutral[400]
            }}>
                📍
            </div>
            <p style={{
                color: DESIGN_TOKENS.colors.neutral[700],
                fontSize: DESIGN_TOKENS.typography.fontSize.base,
                marginBottom: DESIGN_TOKENS.spacing.sm,
                fontWeight: DESIGN_TOKENS.typography.fontWeight.medium
            }}>
                {message}
            </p>
            <p style={{
                color: DESIGN_TOKENS.colors.neutral[500],
                fontSize: DESIGN_TOKENS.typography.fontSize.sm
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
        padding: '0px 0px 0px',
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '0px solid rgba(0,0,0,0.1)',
        minHeight: 0,
        height: 0,
        fontFamily: DESIGN_TOKENS.typography.fontFamily.primary
    }}>
        <span style={{
            fontSize: DESIGN_TOKENS.typography.fontSize.lg,
            fontWeight: DESIGN_TOKENS.typography.fontWeight.semibold,
            color: DESIGN_TOKENS.colors.primary[600]
        }}>
            {user ? `היי ${user.displayName || 'user'}` : 'hello guest'}
        </span>

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
    tabs,
    onAddListing,
    onMessages
}) => {
    const [showSearchBar, setShowSearchBar] = useState(false);

    const toggleSearchBar = () => {
        setShowSearchBar(!showSearchBar);
        if (showSearchBar) {
            // Clear search when hiding
            setSearchQuery("");
            onClearFilters();
        }
    };

    const handleBackButton = () => {
        // Clear search and hide search bar
        setSearchQuery("");
        onClearFilters();
        setShowSearchBar(false);
    };

    return (
        <div className="controls-container" style={{
            padding: `${DESIGN_TOKENS.spacing.md} ${DESIGN_TOKENS.spacing.sm} 0px`,
            display: 'flex',
            flexDirection: 'column',
            gap: DESIGN_TOKENS.spacing.xs,
            alignItems: 'flex-start',
            fontFamily: DESIGN_TOKENS.typography.fontFamily.primary
        }}>
            {showSearchBar ? (
                <div style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    height: '48px'
                }}>
                    <button
                        onClick={handleBackButton}
                        className="back-button"
                        style={{
                            background: 'transparent',
                            color: '#000000',
                            border: 'none',
                            borderRadius: '50%',
                            width: '32px',
                            height: '32px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                        }}
                        onMouseOver={e => e.currentTarget.style.color = '#000000'}
                        onMouseOut={e => e.currentTarget.style.color = '#000000'}
                        aria-label="Back"
                    >
                        <svg 
                            width="16" 
                            height="16" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2"
                        >
                            <polyline points="15,18 9,12 15,6"></polyline>
                        </svg>
                    </button>
                    <SearchBar
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        onSearch={onSearch}
                        onClearFilters={onClearFilters}
                    />
                </div>
            ) : (
                <div className="search-toggle-container" style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '0 8px'
                }}>
                    <button
                        onClick={toggleSearchBar}
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
                        onMouseOver={e => e.currentTarget.style.color = '#333333'}
                        onMouseOut={e => e.currentTarget.style.color = '#000000'}
                        aria-label="Search"
                    >
                        <svg 
                            width="20" 
                            height="20" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2"
                        >
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.35-4.35"></path>
                        </svg>
                    </button>
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
                        onMouseOver={e => e.currentTarget.style.color = '#333333'}
                        onMouseOut={e => e.currentTarget.style.color = '#000000'}
                        aria-label="Add Listing"
                    >
                        <svg 
                            width="20" 
                            height="20" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2"
                        >
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
                        onMouseOver={e => e.currentTarget.style.color = '#333333'}
                        onMouseOut={e => e.currentTarget.style.color = '#000000'}
                        aria-label="Messages"
                    >
                        <svg 
                            width="20" 
                            height="20" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2"
                        >
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                    </button>
                </div>
            )}
            <TabBar
                activeTab={contentType}
                onTabChange={setContentType}
                tabs={tabs}
            />
        </div>
    );
});

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
    const [showGentleLoading, setShowGentleLoading] = useState(false);

    const boundsTimeout = useRef(null);
    const lastFetchedBounds = useRef(null);
    const cacheRef = useRef(new Map());
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();

    // Reset selected category whenever content type changes
    useEffect(() => {
        setSelectedCategory(null);
    }, [contentType]);

    // Memoized base URL
    const baseUrl = useMemo(() => import.meta.env.VITE_API_URL, []);

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

    // Fetch items within bounds with error handling (with cache)
    const fetchItemsWithinBounds = useCallback(async (bounds) => {
        try {
            const currentApiUrl = getApiUrl();
            const { northEast, southWest } = bounds;
            const boundsKey = JSON.stringify(bounds) + contentType + (selectedCategory || '');
            // Check cache first
            if (cacheRef.current.has(boundsKey)) {
                const cached = cacheRef.current.get(boundsKey);
                setAllItems(cached);
                const withCoords = mapItemsToCoords(cached);
                setLocations(withCoords);
                setError(null);
                return;
            }
            const url = `${currentApiUrl}?minLat=${southWest.lat}&maxLat=${northEast.lat}&minLng=${southWest.lng}&maxLng=${northEast.lng}`;
            
            const res = await fetch(url);
            if (!res.ok) {
                throw new Error(`Failed to fetch items: ${res.status}`);
            }
            
            const items = await res.json();
            // Store in cache
            cacheRef.current.set(boundsKey, items);
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
    }, [getApiUrl, mapItemsToCoords, contentType, selectedCategory]);

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

    // Scroll to top on mount and when view/contentType changes
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [view, contentType]);

    // Show loading spinner only if loading lasts > 300ms
    useEffect(() => {
        let timer;
        if (loading) {
            timer = setTimeout(() => setShowGentleLoading(true), 300);
        } else {
            setShowGentleLoading(false);
        }
        return () => clearTimeout(timer);
    }, [loading]);

    return (
        <div className="map-wrapper" style={{
            width: '100vw',
            height: 'calc(100vh - 80px)',
            position: 'relative',
            marginTop: '0px',
            background: DESIGN_TOKENS.colors.neutral[50],
            fontFamily: DESIGN_TOKENS.typography.fontFamily.primary
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
                    border: 1px solid ${DESIGN_TOKENS.colors.neutral[300]};
                    color: ${DESIGN_TOKENS.colors.neutral[700]};
                    border-radius: ${DESIGN_TOKENS.borderRadius.lg};
                    padding: ${DESIGN_TOKENS.spacing.xs} ${DESIGN_TOKENS.spacing.lg};
                    font-size: ${DESIGN_TOKENS.typography.fontSize.sm};
                    font-weight: ${DESIGN_TOKENS.typography.fontWeight.medium};
                    cursor: pointer;
                    transition: all 0.2s ease;
                    white-space: nowrap;
                    font-family: ${DESIGN_TOKENS.typography.fontFamily.primary};
                    box-shadow: ${DESIGN_TOKENS.shadows.sm};
                }
                .category-label.selected, .category-label:hover {
                    background: ${DESIGN_TOKENS.colors.primary[500]};
                    color: #fff;
                    border-color: ${DESIGN_TOKENS.colors.primary[500]};
                    box-shadow: ${DESIGN_TOKENS.shadows.md};
                }
            `}</style>

            {/* Additional CSS for search toggle animation */}
            <style>{`
                .search-toggle-container {
                    transition: all 0.3s ease;
                }
                .search-button, .add-listing-button, .messages-button, .back-button {
                    transition: all 0.2s ease;
                }
                .search-button:hover, .add-listing-button:hover, .messages-button:hover, .back-button:hover {
                    transform: scale(1.05);
                }
                .search-button:active, .add-listing-button:active, .messages-button:active, .back-button:active {
                    transform: scale(0.95);
                }
            `}</style>

            {/* Map update spinner */}
            <style>{`
                .gentle-loading-fade {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    opacity: 1;
                    transition: opacity 0.3s;
                    pointer-events: none;
                    z-index: 2000;
                }
                .gentle-loading-fade.hide {
                    opacity: 0;
                }
            `}</style>
            {
                <div className={`gentle-loading-fade${showGentleLoading ? '' : ' hide'}`}>
                    {showGentleLoading && (
                        <div
                            className="spinner"
                            style={{
                                width: 32,
                                height: 32,
                                border: `4px solid ${DESIGN_TOKENS.colors.neutral[200]}`,
                                borderTop: `4px solid ${DESIGN_TOKENS.colors.primary[500]}`,
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite'
                            }}
                        />
                    )}
                </div>
            }

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
                                        onAddListing={handleAddListing}
                                        onMessages={handleMessages}
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
                            onAddListing={handleAddListing}
                            onMessages={handleMessages}
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
                position: 'absolute',
                bottom: 152,
                right: 16,
                zIndex: 1200,
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
            }}>
                <ToggleViewButton view={view} setView={setView} />
            </div>


        </div>
    );
};

export default GenericMapPage;