import { useAuthContext } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import ModalUploadForm from '../UploadForm/ModalUploadForm';
import { rentalCategories } from '../../constants/categories';

const RequestRentalForm = () => {
    const { user } = useAuthContext();
    const { t } = useTranslation();
    const baseUrl = import.meta.env.VITE_API_URL || 'https://giveit-backend.onrender.com';

    return (
        <ModalUploadForm
            user={user}
            titleText={t('forms.request_rental_title')}
            categories={rentalCategories.map(cat => t(`categories.rental.${cat}`))}
            submitUrl={`${baseUrl}/api/rental_requests`}
            successMessage={t('forms.request_rental_success')}
            submitButtonText={t('forms.submit_request')}
        />
    );
};

export default RequestRentalForm; 