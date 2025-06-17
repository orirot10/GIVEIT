import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../../styles/components/MyItems.css';
import '../../styles/components/ModalCard.css';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import EditModal from './EditModal';
import { useAuthContext } from '../../context/AuthContext';

const ModalCard = ({ item, onDeleteSuccess, onEditSuccess, type = 'rental' }) => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'he';
    const [active, setActive] = useState(item.status === 'available');
    const [showDetails, setShowDetails] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const { user } = useAuthContext();

    const endpoint = type === 'rental' ? 'rentals' : 'services';

    const handleToggleStatus = () => {
        setActive(!active);
    };

    const handleDelete = async () => {
        try {
            const res = await fetch(`https://giveit-backend.onrender.com/api/${endpoint}/${item._id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            if (res.ok) {
                onDeleteSuccess?.(item._id);
            }
        } catch (err) {
            console.error('Delete failed:', err);
        } finally {
            setShowDeleteConfirm(false);
        }
    };

    const handleEditSave = async (updatedItem) => {
        try {
            const res = await fetch(`https://giveit-backend.onrender.com/api/${endpoint}/${item._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify(updatedItem),
            });
            if (res.ok) {
                const data = await res.json();
                onEditSuccess?.(data);
            }
        } catch (err) {
            console.error('Edit failed:', err);
        } finally {
            setShowEditModal(false);
        }
    };

    return (
        <>
            <div className="rental-card" onClick={() => setShowDetails(true)} dir={isRTL ? 'rtl' : 'ltr'}>
                <img 
                    src={Array.isArray(item.images) && item.images.length > 0 
                        ? `https://giveit-backend.onrender.com${item.images[0]}`
                        : 'placeholder.jpg'} 
                    alt={item.title} 
                />
                <h3>{item.title}</h3>
                <p>{item.price}₪ / {type === 'rental' ? t('common.per_day') : t('common.per_hour')}</p>
                <p>{t('common.status')}: {active ? t('common.available') : t('common.not_available')}</p>
                <div className="card-actions">
                    <button className="toggle-view-btn" onClick={(e) => { e.stopPropagation(); setShowEditModal(true); }}>
                        {t('common.edit')}
                    </button>
                    <button className="toggle-view-btn" onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(true); }}>
                        {t('common.delete')}
                    </button>
                    <button className="toggle-view-btn" onClick={(e) => { e.stopPropagation(); handleToggleStatus(); }}>
                        {active ? t('common.mark_unavailable') : t('common.mark_available')}
                    </button>
                </div>
            </div>

            {showDetails && (
                <div className="rental-card-modal" onClick={() => setShowDetails(false)}>
                    <div className="rental-card-modal-content" onClick={(e) => e.stopPropagation()} dir={isRTL ? 'rtl' : 'ltr'}>
                        <h2>{item.title}</h2>
                        <img 
                            src={Array.isArray(item.images) && item.images.length > 0 
                                ? `https://giveit-backend.onrender.com${item.images[0]}`
                                : 'placeholder.jpg'} 
                            alt={item.title} 
                        />
                        <p><strong>{t('common.description')}:</strong> {item.description}</p>
                        <p><strong>{t('common.category')}:</strong> {item.category}</p>
                        <p><strong>{t('common.phone')}:</strong> {item.phone}</p>
                        <p><strong>{t('common.price')}:</strong> {item.price}₪ / {type === 'rental' ? t('common.per_day') : t('common.per_hour')}</p>
                        <p><strong>{t('common.city')}:</strong> {item.city}</p>
                        <p><strong>{t('common.street')}:</strong> {item.street}</p>
                        <button className="rental-close-btn" onClick={() => setShowDetails(false)}>
                            {t('common.close')}
                        </button>
                    </div>
                </div>
            )}

            {showDeleteConfirm && (
                <DeleteConfirmationModal
                    onConfirm={handleDelete}
                    onCancel={() => setShowDeleteConfirm(false)}
                />
            )}

            {showEditModal && (
                <EditModal
                    item={item}
                    type={type}
                    onSave={handleEditSave}
                    onCancel={() => setShowEditModal(false)}
                />
            )}
        </>
    );
};

export default ModalCard;