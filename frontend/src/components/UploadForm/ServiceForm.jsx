import { useAuthContext } from '../../context/AuthContext';
import ModalUploadForm from './ModalUploadForm';
import { serviceCategories } from '../../constants/categories';

const ServiceForm = () => {
const { user } = useAuthContext();

return (
    <ModalUploadForm
    user={user}
    titleText="Offer a New Service"
    categories={serviceCategories}
    submitUrl="http://localhost:5000/api/services"
    successMessage="You successfully offered a new service!"
    submitButtonText="Create Service"
    />
);
};

export default ServiceForm;