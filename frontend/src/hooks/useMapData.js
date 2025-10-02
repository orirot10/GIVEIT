import { useState, useEffect, useRef, useCallback } from 'react';

const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const useMapData = (tabType) => {
  const [data, setData] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);
  const baseUrl = import.meta.env.VITE_API_URL || 'https://giveit-backend.onrender.com';

  const getApiUrl = useCallback((type) => {
    const urls = {
      rentals: `${baseUrl}/api/rentals`,
      services: `${baseUrl}/api/services`,
      rental_requests: `${baseUrl}/api/rental_requests`,
      service_requests: `${baseUrl}/api/service_requests`
    };
    return urls[type] || urls.services;
  }, [baseUrl]);

  const fetchData = useCallback(async (type, isBackground = false) => {
    const cached = cache.get(type);
    
    // Return fresh cache immediately
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      if (!isBackground) setData(cached.data);
      return cached.data;
    }

    // Show stale cache while fetching
    if (cached && !isBackground) setData(cached.data);

    if (!isBackground) setIsFetching(true);
    setError(null);

    try {
      if (abortRef.current) abortRef.current.abort();
      abortRef.current = new AbortController();

      const response = await fetch(getApiUrl(type), {
        signal: abortRef.current.signal
      });
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const rawData = await response.json();
      const items = Array.isArray(rawData) ? rawData : [];
      
      const transformedData = items
        .map(item => ({
          ...item,
          lat: item.lat ?? item.location?.coordinates?.[1],
          lng: item.lng ?? item.location?.coordinates?.[0],
          id: item._id || item.id,
          type
        }))
        .filter(item => typeof item.lat === 'number' && typeof item.lng === 'number');

      cache.set(type, { data: transformedData, timestamp: Date.now() });
      setData(transformedData);
      
      // Prefetch other tab
      const prefetchMap = {
        'services': 'service_requests',
        'service_requests': 'services', 
        'rentals': 'rental_requests',
        'rental_requests': 'rentals'
      };
      const otherTab = prefetchMap[type];
      if (otherTab && !cache.has(otherTab)) {
        setTimeout(() => fetchData(otherTab, true), 100);
      }
      
      return transformedData;
    } catch (err) {
      if (err.name === 'AbortError') return;
      setError(err.message);
    } finally {
      setIsFetching(false);
    }
  }, [getApiUrl]);

  useEffect(() => {
    if (tabType) fetchData(tabType);
  }, [tabType, fetchData]);

  return { data, isFetching, error };
};

export default useMapData;