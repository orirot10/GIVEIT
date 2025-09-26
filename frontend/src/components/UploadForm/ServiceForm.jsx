import { useAuthContext } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import ModalUploadForm from './ModalUploadForm';
import { serviceCategoryData, extraServiceCategoryData } from '../../constants/categories';

const allServiceCategories = [...serviceCategoryData, ...extraServiceCategoryData];

const ServiceForm = () => {
    const { user } = useAuthContext();
    const { t } = useTranslation();
    const baseUrl = import.meta.env.VITE_API_URL || 'https://giveit-backend.onrender.com';

    return (
        <ModalUploadForm
            user={user}
            titleText={t('forms.offer_service_title')}
            categoryData={allServiceCategories}
            submitUrl={`${baseUrl}/api/services/with-urls`}
            successMessage={t('forms.offer_service_success')}
            submitButtonText={t('forms.submit_offer')}
        />
    );
};

export default ServiceForm;