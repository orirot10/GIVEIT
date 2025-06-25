import { useAuthContext } from '../../context/AuthContext';
import ModalUploadForm from './ModalUploadForm';
import { rentalCategories } from '../../constants/categories';
import { geocodeAddress } from '../HomePage/geocode';

const RentalForm = () => {
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
            if (!response.ok) throw new Error('Failed to create rental');
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
            titleText="Offer an Item for Rent"
            categories={rentalCategories}
            submitUrl={`${baseUrl}/api/rentals`}
            successMessage="You successfully offered a rental item!"
            submitButtonText="Submit Offer"
        />
    );
};

export default RentalForm;