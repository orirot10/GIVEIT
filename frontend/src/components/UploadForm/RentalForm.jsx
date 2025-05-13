import { useAuthContext } from '../../context/AuthContext';
import ModalUploadForm from './ModalUploadForm';
import { rentalCategories } from '../../constants/categories';

const RentalForm = () => {
const { user } = useAuthContext();

return (
    <ModalUploadForm
    user={user}
    titleText="Upload Item for Rent"
    categories={rentalCategories}
    submitUrl="https://giveit-backend.onrender.com/api/rentals"
    successMessage="You successfully uploaded a new rental!"
    submitButtonText="Upload"
    />
);
};

export default RentalForm;