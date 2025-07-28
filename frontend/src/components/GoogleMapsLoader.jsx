import { LoadScript } from '@react-google-maps/api';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const LIBRARIES = ['places'];

const GoogleMapsLoader = ({ children }) => {
    return (
        <LoadScript
            googleMapsApiKey={GOOGLE_MAPS_API_KEY}
            libraries={LIBRARIES}
            loadingElement={<div />}
        >
            {children}
        </LoadScript>
    );
};

export default GoogleMapsLoader;
