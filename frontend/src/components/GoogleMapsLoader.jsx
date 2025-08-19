import { useJsApiLoader } from '@react-google-maps/api';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const LIBRARIES = ['places'];

const GoogleMapsLoader = ({ children }) => {
    const { isLoaded, loadError } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
        libraries: LIBRARIES,
        language: 'he',
        region: 'IL'
    });

    if (loadError) {
        return <div className="p-4 text-center">Failed to load map</div>;
    }

    if (!isLoaded) {
        return <div className="p-4 text-center">Loading map...</div>;
    }

    return children;
};

export default GoogleMapsLoader;
