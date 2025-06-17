import { useAuthContext } from '../../context/AuthContext';
import ModalUploadForm from '../UploadForm/ModalUploadForm';
import { serviceCategories } from '../../constants/categories';

const RequestServiceForm = () => {
    const { user } = useAuthContext();
    const baseUrl = import.meta.env.VITE_API_URL || 'https://giveit-backend.onrender.com';

    return (
        <ModalUploadForm
            user={user}
            titleText="Request a Service"
            categories={serviceCategories}
            submitUrl={`${baseUrl}/api/service_requests`}
            successMessage="You successfully created a service request!"
            submitButtonText="Submit Request"
        />
    );
};

export default RequestServiceForm; 