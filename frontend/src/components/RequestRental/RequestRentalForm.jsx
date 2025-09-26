import { useAuthContext } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import ModalUploadForm from '../UploadForm/ModalUploadForm';
import { rentalCategoryData, extraRentalCategoryData } from '../../constants/categories';

const allRentalCategories = [...rentalCategoryData, ...extraRentalCategoryData];

const RequestRentalForm = () => {
    const { user } = useAuthContext();
    const { t } = useTranslation();
    const baseUrl = import.meta.env.VITE_API_URL || 'https://giveit-backend.onrender.com';

    return (
        <ModalUploadForm
            user={user}
            titleText={t('forms.request_rental_title')}
            categoryData={allRentalCategories}
            submitUrl={`${baseUrl}/api/rental_requests`}
            successMessage={t('forms.request_rental_success')}
            submitButtonText={t('forms.submit_request')}
        />
    );
};

export default RequestRentalForm; 