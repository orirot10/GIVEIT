import { useAuthContext } from '../../context/AuthContext';
import ModalUploadForm from './ModalUploadForm';
import { serviceCategories } from '../../constants/categories';
import { geocodeAddress } from '../HomePage/geocode';

const ServiceForm = () => {
    const { user } = useAuthContext();
    const baseUrl = import.meta.env.VITE_API_URL || 'https://giveit-backend.onrender.com';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            // Geocode address
            const coords = await geocodeAddress(formData.street, formData.city);
            const body = {
                ...formData,
                price: parseFloat(formData.price),
                lat: coords ? coords.lat : undefined,
                lng: coords ? coords.lng : undefined
            };
            const response = await fetch(submitUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            if (!response.ok) throw new Error('Failed to create service');
            // ... existing code ...
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ModalUploadForm
            user={user}
            titleText="Offer a Service"
            categories={serviceCategories}
            submitUrl={`${baseUrl}/api/services/with-urls`}
            successMessage="You successfully offered a service!"
            submitButtonText="Submit Offer"
        />
    );
};

export default ServiceForm;