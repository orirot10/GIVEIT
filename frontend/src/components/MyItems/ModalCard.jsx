import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../../styles/components/MyItems.css';
import '../../styles/components/ModalCard.css';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import EditModal from './EditModal';
import { useAuthContext } from '../../context/AuthContext';
import { usePricePeriodTranslation } from '../../utils/pricePeriodTranslator';

const placeholderSVG = `<svg width='80' height='80' xmlns='http://www.w3.org/2000/svg'><rect width='80' height='80' rx='12' fill='#F4F6F8' stroke='#B0BEC5' stroke-width='2'/><rect x='18' y='32' width='44' height='28' rx='6' fill='#CFD8DC'/><rect x='28' y='44' width='24' height='10' rx='3' fill='#B0BEC5'/></svg>`;

const ModalCard = ({ item, onDeleteSuccess, onEditSuccess, type = 'rental' }) => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'he';
    const { translatePricePeriod } = usePricePeriodTranslation();
    const [active, setActive] = useState(item.status === 'available');
    const [showDetails, setShowDetails] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const { user } = useAuthContext();

    const endpoint = type === 'rental' ? 'rentals' : 'services';
    const baseUrl = import.meta.env.VITE_API_URL || 'https://giveit-backend.onrender.com';
    const firstImage = Array.isArray(item.images) && item.images.length > 0 ? item.images[0] : null;
    const imageUrl = firstImage
        ? (firstImage.startsWith('http') ? firstImage : `${baseUrl}${firstImage}`)
        : '';

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
            <div
                className="rental-card"
                onClick={() => setShowDetails(true)}
                dir={isRTL ? 'rtl' : 'ltr'}
               
                onMouseOver={e => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(38,166,154,0.18)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseOut={e => { e.currentTarget.style.boxShadow = '0 2px 12px rgba(60,72,88,0.10)'; e.currentTarget.style.transform = 'none'; }}
            >
                <div>
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={item.title}
                            onError={e => { e.target.onerror = null; e.target.src = ''; e.target.parentNode.innerHTML = placeholderSVG; }}
                        />
                    ) : (
                        <span dangerouslySetInnerHTML={{ __html: placeholderSVG }} />
                    )}
                </div>
                <h3>{item.title}</h3>
                <div>
                    <span>
                        {active ? t('common.available') : t('common.not_available')}
                    </span>
                </div>
                <div>
                    {item.price}₪ / {translatePricePeriod(item.pricePeriod)}
                </div>
                <div className="card-actions">
                    <button
                        className="toggle-view-btn"
                       
                        onClick={e => { e.stopPropagation(); setShowEditModal(true); }}
                        aria-label={t('common.edit')}
                    >
                        <span role="img" aria-label="edit">✏️</span>
                    </button>
                    <button
                        className="toggle-view-btn"
                       
                        onClick={e => { e.stopPropagation(); setShowDeleteConfirm(true); }}
                        aria-label={t('common.delete')}
                    >
                        <span role="img" aria-label="delete">🗑</span>
                    </button>
                    <button
                        className="toggle-view-btn"
                       
                        onClick={e => { e.stopPropagation(); handleToggleStatus(); }}
                        aria-label={active ? t('common.mark_unavailable') : t('common.mark_available')}
                    >
                        <span role="img" aria-label="toggle">{active ? '✅' : '❌'}</span>
                    </button>
                </div>
            </div>

            {showDetails && (
                <div className="rental-card-modal" onClick={() => setShowDetails(false)}>
                    <div className="rental-card-modal-content" onClick={e => e.stopPropagation()} dir={isRTL ? 'rtl' : 'ltr'}>
                        <button onClick={() => setShowDetails(false)} aria-label="close">✖️</button>
                        <h2>{item.title}</h2>
                        <div>
                            {imageUrl ? (
                                <img
                                    src={imageUrl}
                                    alt={item.title}
                                    onError={e => { e.target.onerror = null; e.target.src = ''; e.target.parentNode.innerHTML = placeholderSVG; }}
                                />
                            ) : (
                                <span dangerouslySetInnerHTML={{ __html: placeholderSVG }} />
                            )}
                        </div>
                        <div><strong>{t('common.description')}:</strong> {item.description}</div>
                        <div><strong>{t('common.category')}:</strong> {item.category}</div>
                        <div><strong>{t('common.phone')}:</strong> {item.phone}</div>
                        <div><strong>{t('common.price')}:</strong> {item.price}₪ / {translatePricePeriod(item.pricePeriod)}</div>
                        {item.location && (
                            <div><strong>{t('common.location')}:</strong> {item.location}</div>
                        )}
                        {item.city && (
                            <div><strong>{t('common.city')}:</strong> {item.city}</div>
                        )}
                        {item.street && (
                            <div><strong>{t('common.street')}:</strong> {item.street}</div>
                        )}
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
