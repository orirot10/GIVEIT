import { useAuthContext } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import ModalUploadForm from '../UploadForm/ModalUploadForm';
import { serviceCategoryData, extraServiceCategoryData } from '../../constants/categories';

const allServiceCategories = [...serviceCategoryData, ...extraServiceCategoryData];

const RequestServiceForm = () => {
    const { user } = useAuthContext();
    const { t } = useTranslation();
    const baseUrl = import.meta.env.VITE_API_URL || 'https://giveit-backend.onrender.com';

    return (
        <ModalUploadForm
            user={user}
            titleText={t('forms.request_service_title')}
            categoryData={allServiceCategories}
            submitUrl={`${baseUrl}/api/service_requests`}
            successMessage={t('forms.request_service_success')}
            submitButtonText={t('forms.submit_request')}
        />
    );
};

export default RequestServiceForm; 