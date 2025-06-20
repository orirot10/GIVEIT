import { useAuthContext } from '../../context/AuthContext';
import ModalUploadForm from './ModalUploadForm';
import { rentalCategories } from '../../constants/categories';

const RentalForm = () => {
    const { user } = useAuthContext();
    const baseUrl = import.meta.env.VITE_API_URL || 'https://giveit-backend.onrender.com';

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