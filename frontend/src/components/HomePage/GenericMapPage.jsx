import React, { useEffect, useState } from "react";
import MapView from "./MapView";
import ListView from "./ListView";
import FilterButton from './FilterButton';
import ToggleViewButton from "./ToggleViewButton";
import { geocodeAddress } from "./geocode";
import SearchBar from "./SearchBar";
import '../../styles/HomePage/GenericMapPage.css';
import { handleSearch as searchItems } from "./searchHelpers";

const GenericMapPage = ({ apiUrl, title }) => {
    const [allItems, setAllItems] = useState([]);
    const [locations, setLocations] = useState([]);
    const [view, setView] = useState("map");
    const [searchQuery, setSearchQuery] = useState("");
    const [appliedFilters, setAppliedFilters] = useState({ categories: [], maxPrice: null });

    useEffect(() => {
        const fetchAndMap = async () => {
            const res = await fetch(apiUrl);
            const items = await res.json();
            setAllItems(items);
            const withCoords = await mapItemsToCoords(items);
            setLocations(withCoords);
        };

        fetchAndMap();
    }, [apiUrl]);

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
        searchItems({ apiUrl, searchQuery, setAllItems, setLocations });
    };

    const handleFilter = ({ categories, maxPrice }) => {
        setAppliedFilters({ categories, maxPrice });

        let url = `${apiUrl}/filter?`;

        if (categories.length > 0) {
            const encodedCategories = categories.map(encodeURIComponent).join(",");
            url += `category=${encodedCategories}&`;
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
        setAppliedFilters({ categories: [], maxPrice: null });

        fetch(apiUrl)
            .then((res) => res.json())
            .then(async (data) => {
                setAllItems(data);
                const withCoords = await mapItemsToCoords(data);
                setLocations(withCoords);
            });
    };

    const handleRemoveCategory = (catToRemove) => {
        const updatedCategories = appliedFilters.categories.filter(cat => cat !== catToRemove);
        handleFilter({ categories: updatedCategories, maxPrice: appliedFilters.maxPrice });
    };

    const handleRemovePrice = () => {
        handleFilter({ categories: appliedFilters.categories, maxPrice: null });
    };

    const filterCount = appliedFilters.categories.length + (appliedFilters.maxPrice !== null ? 1 : 0);

    return (
        <div className="p-4 flex flex-col gap-4 items-center">
            <h2 className="text-2xl font-bold text-center">{title || "Explore"}</h2>

            <div className="search-filter-row flex flex-col sm:flex-row gap-2 items-center">
                <div className="search-filter-container flex-1">
                    <SearchBar
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        onSearch={handleSearch}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <FilterButton
                        onApplyFilters={handleFilter}
                        categoryType={apiUrl.includes("rentals") ? "rental" : "service"}
                    />
                    {filterCount > 0 && (
                        <>
                            <button
                                onClick={handleClearFilters}
                                className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors"
                                title="Clear all filters"
                            >
                                Clear Filters
                            </button>
                            <span className="bg-gray-200 text-gray-800 text-sm font-medium px-2 py-1 rounded-full">
                                {filterCount} {filterCount === 1 ? "filter" : "filters"} applied
                            </span>
                        </>
                    )}
                </div>
            </div>

            {/* Active Filter Buttons */}
            {filterCount > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                    {appliedFilters.categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => handleRemoveCategory(cat)}
                            className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded-full hover:bg-blue-200 transition"
                        >
                            {cat} ✕
                        </button>
                    ))}
                    {appliedFilters.maxPrice !== null && (
                        <button
                            onClick={handleRemovePrice}
                            className="bg-green-100 text-green-800 text-sm font-medium px-2 py-1 rounded-full hover:bg-green-200 transition"
                        >
                            Max Price: ₪{appliedFilters.maxPrice} ✕
                        </button>
                    )}
                </div>
            )}

            <div className="map-wrapper w-full">
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
