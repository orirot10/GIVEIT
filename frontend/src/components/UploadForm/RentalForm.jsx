import { useAuthContext } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import ModalUploadForm from './ModalUploadForm';
import { rentalCategoryData } from '../../constants/categories';

const allRentalCategories = [...rentalCategoryData];

const RentalForm = () => {
    const { user } = useAuthContext();
    const { t } = useTranslation();
    const baseUrl = import.meta.env.VITE_API_URL || 'https://giveit-backend.onrender.com';

    return (
        <ModalUploadForm
            user={user}
            titleText={t('forms.offer_rental_title')}
            categoryData={allRentalCategories}
            submitUrl={`${baseUrl}/api/rentals`}
            successMessage={t('forms.offer_rental_success')}
            submitButtonText={t('forms.submit_offer')}
        />
    );
};

export default RentalForm;