import { useState, useEffect, useRef, useCallback } from 'react';

// Simple React Query-like cache
const cache = new Map<string, { data: any[]; timestamp: number; stale: boolean }>();
const STALE_TIME = 5 * 60 * 1000; // 5 minutes
const CACHE_TIME = 30 * 60 * 1000; // 30 minutes

interface UseMapDataResult {
  data: any[];
  isFetching: boolean;
  error: string | null;
}

const useMapData = (tabType: string): UseMapDataResult => {
  const [data, setData] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const baseUrl = import.meta.env.VITE_API_URL || 'https://giveit-backend.onrender.com';

  const getApiUrl = useCallback((type: string) => {
    const urls: Record<string, string> = {
      rentals: `${baseUrl}/api/rentals`,
      services: `${baseUrl}/api/services`,
      rental_requests: `${baseUrl}/api/rental_requests`,
      service_requests: `${baseUrl}/api/service_requests`
    };
    return urls[type] || urls.services;
  }, [baseUrl]);

  const fetchData = useCallback(async (type: string, isBackground = false) => {
    const cached = cache.get(type);
    const now = Date.now();
    
    // Return fresh cache instantly
    if (cached && !cached.stale && (now - cached.timestamp) < STALE_TIME) {
      if (!isBackground) setData(cached.data);
      return cached.data;
    }

    // Show stale cache while fetching fresh data
    if (cached && !isBackground) {
      setData(cached.data);
    }

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

      // Update cache
      cache.set(type, { data: transformedData, timestamp: now, stale: false });
      setData(transformedData);
      
      // Prefetch other tab data
      const prefetchMap: Record<string, string> = {
        'services': 'service_requests',
        'service_requests': 'services', 
        'rentals': 'rental_requests',
        'rental_requests': 'rentals'
      };
      const otherTab = prefetchMap[type];
      if (otherTab && !cache.has(otherTab)) {
        console.log(`useMapData: Prefetching ${otherTab} in background`);
        setTimeout(() => fetchData(otherTab, true), 100);
      }
      
      return transformedData;
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      setError(err.message);
      console.error(`useMapData: Fetch error for ${type}:`, err);
    } finally {
      setIsFetching(false);
    }
  }, [getApiUrl]);

  // Debounced tab switching
  const debouncedFetch = useRef<NodeJS.Timeout>();
  useEffect(() => {
    if (!tabType) return;
    
    clearTimeout(debouncedFetch.current);
    debouncedFetch.current = setTimeout(() => {
      fetchData(tabType);
    }, 150); // 150ms debounce
    
    return () => clearTimeout(debouncedFetch.current);
  }, [tabType, fetchData]);

  // Cleanup stale cache entries
  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = Date.now();
      for (const [key, value] of cache.entries()) {
        if (now - value.timestamp > CACHE_TIME) {
          cache.delete(key);
        } else if (now - value.timestamp > STALE_TIME) {
          value.stale = true;
        }
      }
    }, 60000); // Cleanup every minute
    
    return () => clearInterval(cleanup);
  }, []);

  return { data, isFetching, error };
};

export default useMapData;