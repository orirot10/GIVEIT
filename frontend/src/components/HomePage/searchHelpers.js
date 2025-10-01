import { geocodeAddress } from "./geocode";

export const handleSearch = async ({ apiUrl, searchQuery, category, subcategory, setAllItems, setLocations }) => {
try {
    let params = new URLSearchParams();
    if (searchQuery.trim()) {
        params.append('query', searchQuery);
    }
    if (category) params.append('category', category);
    if (subcategory) params.append('subcategory', subcategory);

    const fetchUrl = params.toString() ? `${apiUrl}/search?${params.toString()}` : apiUrl;

    const res = await fetch(fetchUrl);
    const data = await res.json();
    const results = Array.isArray(data) ? data : [];

    setAllItems(results);

    const withCoords = await Promise.all(
    results.map(async (item) => {
        const { street, city } = item;
        if (!street || !city || street.length < 3 || city.length < 2) return null;

        const coords = await geocodeAddress(street, city);
        if (coords) {
        return {
            id: item._id,
            title: item.title,
            description: item.description,
            category: item.category,
            priceLabel: item.price ? `${item.price}₪` : null,
            photo: item.photo,
            firstName: item.firstName,
            lastName: item.lastName,
            phone: item.phone,
            ...coords,
        };
        } else {
        return null;
        }
    })
    );

    setLocations(withCoords.filter(Boolean));
} catch (err) {
    console.error("Search failed:", err);
}
};
