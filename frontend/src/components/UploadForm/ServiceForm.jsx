import { useAuthContext } from '../../context/AuthContext';
import ModalUploadForm from './ModalUploadForm';
import { serviceCategories } from '../../constants/categories';

const ServiceForm = () => {
    const { user } = useAuthContext();
    const baseUrl = import.meta.env.VITE_API_URL || 'https://giveit-backend.onrender.com';

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