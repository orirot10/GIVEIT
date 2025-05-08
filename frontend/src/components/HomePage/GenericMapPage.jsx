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
            console.log('[GenericMapPage] Items fetched from API:', items);
            setAllItems(items);
            const withCoords = await mapItemsToCoords(items);
            console.log('[GenericMapPage] Items after adding coords (locations state):', withCoords);
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
        <div className="p-2 flex flex-col gap-2 items-center">
            <h2 className="text-2xl font-bold text-center">{title || "Explore"}</h2>

            <div className="w-full flex flex-col gap-2 items-center">
                <div className="w-full">
                    <SearchBar
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        onSearch={handleSearch}
                        onClearFilters={handleClearFilters} // Added onClearFilters prop
                    />
                </div>

                <div className="w-full flex justify-center">
                    <div className="flex items-center gap-1">
                        <FilterButton
                            onApplyFilters={handleFilter}
                            categoryType={apiUrl.includes("rentals") ? "rental" : "service"}
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
                <div className="flex flex-wrap gap-2 mt-2">
                    {appliedFilters.categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => handleRemoveCategory(cat)}
                            className="bg-blue-200 text-blue-800 font-medium px-3 py-2 rounded-full hover:bg-blue-200"
                        >
                            {cat} ✕
                        </button>
                    ))}
                    {appliedFilters.maxPrice !== null && (
                        <button
                            onClick={handleRemovePrice}
                            className="bg-green-200 text-green-800 font-medium px-3 py-2 rounded-full hover:bg-green-200"
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