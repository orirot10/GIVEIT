import { useAuthContext } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import ModalUploadForm from './ModalUploadForm';
import { getRentalTagOptions } from '../../constants/categories';

const RentalForm = () => {
    const { user } = useAuthContext();
    const { t, i18n } = useTranslation();
    const baseUrl = import.meta.env.VITE_API_URL || 'https://giveit-backend.onrender.com';

    return (
        <ModalUploadForm
            user={user}
            titleText={t('forms.offer_rental_title')}
            categories={getRentalTagOptions(i18n.language)}
            submitUrl={`${baseUrl}/api/rentals`}
            successMessage={t('forms.offer_rental_success')}
            submitButtonText={t('forms.submit_offer')}
        />
    );
};

export default RentalForm;