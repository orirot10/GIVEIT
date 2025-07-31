export const geocodeAddress = async (street, city) => {
    const query = [street, city].filter(Boolean).join(', ');
    const address = encodeURIComponent(query);
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${apiKey}&region=il&language=he`
    );

    const data = await response.json();

    if (data.status === "OK") {
        const location = data.results[0].geometry.location;
        return {
            lat: location.lat,
            lng: location.lng,
        };
    } else {
        console.error('Geocoding error:', data.status, street, city);
        return null;
    }
};