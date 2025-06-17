import { useTranslation } from 'react-i18next';
import '../../styles/components/Modal.css';

const DeleteConfirmationModal = ({ onConfirm, onCancel }) => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'he';

    return (
        <div className="modal">
            <div className="modal-content small" dir={isRTL ? 'rtl' : 'ltr'}>
                <p>{t('my_items.delete_confirmation')}</p>
                <div className="modal-buttons">
                    <button className="danger" onClick={onConfirm}>{t('common.delete')}</button>
                    <button onClick={onCancel}>{t('common.cancel')}</button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;