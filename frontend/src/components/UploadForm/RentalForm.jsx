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
    submitUrl="http://localhost:5000/api/rentals"
    successMessage="You successfully uploaded a new rental!"
    submitButtonText="Upload"
    />
);
};

export default RentalForm;