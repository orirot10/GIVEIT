import React, { useEffect, useState } from "react";
import MapView from "./MapView";
import ListView from "./ListView";
import FilterButton from './FilterButton';
import ToggleViewButton from "./ToggleViewButton";
import ContentTypeToggle from "./ContentTypeToggle";
import { geocodeAddress } from "./geocode";
import SearchBar from "./SearchBar";
import '../../styles/HomePage/GenericMapPage.css';
import { handleSearch as searchItems } from "./searchHelpers";

const GenericMapPage = ({ title, apiUrl }) => {
    const [allItems, setAllItems] = useState([]);
    const [locations, setLocations] = useState([]);
    const [view, setView] = useState("map");
    const [contentType, setContentType] = useState("rentals");
    const [searchQuery, setSearchQuery] = useState("");
    const [appliedFilters, setAppliedFilters] = useState({ categories: [], minPrice: null, maxPrice: null });

    // Function to get the appropriate API URL based on content type
    const getApiUrl = () => {
        const baseUrl = import.meta.env.VITE_API_URL;
        if (apiUrl.includes('service_requests')) {
            return `${baseUrl}/api/service_requests`;
        } else if (apiUrl.includes('rental_requests')) {
            return `${baseUrl}/api/rental_requests`;
        } else if (apiUrl.includes('services')) {
            return `${baseUrl}/api/services`;
        } else {
            return `${baseUrl}/api/rentals`;
        }
    };

    useEffect(() => {
        const fetchAndMap = async () => {
            try {
                const currentApiUrl = getApiUrl();
                console.log('Fetching from URL:', currentApiUrl);
                const res = await fetch(currentApiUrl);
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                const items = await res.json();
                console.log(`[GenericMapPage] ${contentType} fetched from API:`, items);
                setAllItems(items);
                const withCoords = await mapItemsToCoords(items);
                console.log(`[GenericMapPage] ${contentType} after adding coords:`, withCoords);
                setLocations(withCoords);
            } catch (error) {
                console.error('Error fetching items:', error);
                setAllItems([]);
                setLocations([]);
            }
        };

        fetchAndMap();
    }, [contentType, apiUrl]); // Re-fetch when content type or apiUrl changes

    const mapItemsToCoords = async (items) => {
        const mapped = await Promise.all(
            items.map(async (item) => {
                const { street, city } = item;
                if (!street || !city || street.length < 3 || city.length < 2) return null;

                const coords = await geocodeAddress(street, city);
                return coords
                    ? { ...item, ...coords, id: item._id }
                    : null;
            })
        );

        return mapped.filter(Boolean);
    };

    const handleSearch = () => {
        const currentApiUrl = getApiUrl();
        searchItems({ apiUrl: currentApiUrl, searchQuery, setAllItems, setLocations });
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
            url += `maxPrice=${maxPrice}`;
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
        setAppliedFilters({ categories: [], minPrice: null, maxPrice: null });
        const currentApiUrl = getApiUrl();

        fetch(currentApiUrl)
            .then((res) => res.json())
            .then(async (data) => {
                setAllItems(data);
                const withCoords = await mapItemsToCoords(data);
                setLocations(withCoords);
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

    return (
        <div className="p-2 flex flex-col gap-1 items-center">
            <h2 className="text-2xl font-bold text-center">{title || "Explore"}</h2>

            <div className="w-full flex flex-col gap-1 items-center">
                <div className="w-full">
                    <SearchBar
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        onSearch={handleSearch}
                        onClearFilters={handleClearFilters}
                    />
                </div>

                <ContentTypeToggle 
                    contentType={contentType}
                    setContentType={setContentType}
                />

                <div className="w-full flex justify-center">
                    <div className="flex items-center gap-0">
                        <FilterButton
                            onApplyFilters={handleFilter}
                            categoryType={contentType === "rentals" ? "rental" : "service"}
                        />
                        {filterCount > 0 && (
                            <>
                                <button
                                    onClick={handleClearFilters}
                                    className="search-filter-style red"
                                    title="Clear all filters"
                                >
                                    Clear Filters
                                </button>
                                <span className="search-filter-style gray">
                                    {filterCount} {filterCount === 1 ? "filter" : "filters"} applied
                                </span>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Active Filter Buttons */}
            {filterCount > 0 && (
                <div className="flex-wrap gap-1 mt-1">
                    {appliedFilters.categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => handleRemoveCategory(cat)}
                            className="bg-blue-200 text-blue-800 font-medium px-4 py-3 rounded-full hover:bg-blue-200"
                        >
                            {cat} ✕
                        </button>
                    ))}
                    {appliedFilters.minPrice !== null && (
                        <button
                            onClick={handleRemovePrice}
                            className="bg-green-200 text-green-800 font-medium px-3 py-2 rounded-full hover:bg-green-200"
                        >
                            : {appliedFilters.minPrice}₪ ✕
                        </button>
                    )}
                    {appliedFilters.maxPrice !== null && (
                        <button
                            onClick={handleRemovePrice}
                            className="bg-green-200 text-green-800 font-medium px-3 py-2 rounded-full hover:bg-green-200"
                        >
                            : {appliedFilters.maxPrice}₪ ✕
                        </button>
                    )}
                </div>
            )}

            <div className="map-wrapper w-full mb-0 pb-0">
                <ToggleViewButton view={view} setView={setView} />
                {view === "map" ? (
                    <MapView locations={locations} />
                ) : (
                    <ListView rentals={allItems} />
                )}
            </div>
        </div>
    );
};

export default GenericMapPage;