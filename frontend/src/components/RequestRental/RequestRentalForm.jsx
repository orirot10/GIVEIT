import { useAuthContext } from '../../context/AuthContext';
import ModalUploadForm from '../UploadForm/ModalUploadForm';
import { rentalCategories } from '../../constants/categories';

const RequestRentalForm = () => {
    const { user } = useAuthContext();
    const baseUrl = import.meta.env.VITE_API_URL || 'https://giveit-backend.onrender.com';

    return (
        <ModalUploadForm
            user={user}
            titleText="Request an Item for Rent"
            categories={rentalCategories}
            submitUrl={`${baseUrl}/api/rental_requests`}
            successMessage="You successfully created a rental request!"
            submitButtonText="Submit Request"
        />
    );
};

export default RequestRentalForm; 