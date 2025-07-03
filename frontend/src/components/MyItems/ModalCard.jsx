import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../../styles/components/MyItems.css';
import '../../styles/components/ModalCard.css';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import EditModal from './EditModal';
import { useAuthContext } from '../../context/AuthContext';

const placeholderSVG = `<svg width='80' height='80' xmlns='http://www.w3.org/2000/svg'><rect width='80' height='80' rx='12' fill='#F4F6F8' stroke='#B0BEC5' stroke-width='2'/><rect x='18' y='32' width='44' height='28' rx='6' fill='#CFD8DC'/><rect x='28' y='44' width='24' height='10' rx='3' fill='#B0BEC5'/></svg>`;

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
            <div
                className="rental-card"
                onClick={() => setShowDetails(true)}
                dir={isRTL ? 'rtl' : 'ltr'}
                style={{
                    background: '#fff',
                    borderRadius: 16,
                    boxShadow: '0 2px 12px rgba(60,72,88,0.10)',
                    padding: 20,
                    margin: '12px 0',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    cursor: 'pointer',
                    transition: 'box-shadow 0.2s, transform 0.2s',
                }}
                onMouseOver={e => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(38,166,154,0.18)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseOut={e => { e.currentTarget.style.boxShadow = '0 2px 12px rgba(60,72,88,0.10)'; e.currentTarget.style.transform = 'none'; }}
            >
                <div style={{ width: 80, height: 80, borderRadius: 12, overflow: 'hidden', background: '#F4F6F8', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                    {Array.isArray(item.images) && item.images.length > 0 && item.images[0] ? (
                        <img
                            src={`https://giveit-backend.onrender.com${item.images[0]}`}
                            alt={item.title}
                            style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 12 }}
                            onError={e => { e.target.onerror = null; e.target.src = ''; e.target.parentNode.innerHTML = placeholderSVG; }}
                        />
                    ) : (
                        <span dangerouslySetInnerHTML={{ __html: placeholderSVG }} />
                    )}
                </div>
                <h3 style={{ fontFamily: 'Alef, Inter, sans-serif', fontSize: 18, fontWeight: 700, color: '#1C2526', margin: '0 0 6px', textAlign: isRTL ? 'right' : 'left', width: '100%' }}>{item.title}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, width: '100%', justifyContent: isRTL ? 'flex-end' : 'flex-start' }}>
                    <span style={{
                        background: active ? '#C8E6C9' : '#ECEFF1',
                        color: active ? '#388E3C' : '#607D8B',
                        borderRadius: 8,
                        padding: '2px 10px',
                        fontSize: 13,
                        fontWeight: 600,
                        display: 'inline-block',
                    }}>
                        {active ? t('common.available') : t('common.not_available')}
                    </span>
                </div>
                <div style={{ fontFamily: 'Alef, Inter, sans-serif', fontSize: 15, color: '#607D8B', marginBottom: 8, width: '100%', textAlign: isRTL ? 'right' : 'left' }}>
                    {item.price}₪ / {type === 'rental' ? t('common.per_day') : t('common.per_hour')}
                </div>
                <div className="card-actions" style={{ display: 'flex', gap: 10, marginTop: 8, width: '100%', justifyContent: isRTL ? 'flex-end' : 'flex-start' }}>
                    <button
                        className="toggle-view-btn"
                        style={{
                            background: '#E3F2FD', color: '#1976D2', border: 'none', borderRadius: 20, padding: '6px 14px', fontSize: 14, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer', transition: 'background 0.2s',
                        }}
                        onClick={e => { e.stopPropagation(); setShowEditModal(true); }}
                        aria-label={t('common.edit')}
                    >
                        <span role="img" aria-label="edit">✏️</span>
                    </button>
                    <button
                        className="toggle-view-btn"
                        style={{
                            background: '#FFEBEE', color: '#D32F2F', border: 'none', borderRadius: 20, padding: '6px 14px', fontSize: 14, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer', transition: 'background 0.2s',
                        }}
                        onClick={e => { e.stopPropagation(); setShowDeleteConfirm(true); }}
                        aria-label={t('common.delete')}
                    >
                        <span role="img" aria-label="delete">🗑</span>
                    </button>
                    <button
                        className="toggle-view-btn"
                        style={{
                            background: active ? '#C8E6C9' : '#ECEFF1', color: active ? '#388E3C' : '#607D8B', border: 'none', borderRadius: 20, padding: '6px 14px', fontSize: 14, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer', transition: 'background 0.2s',
                        }}
                        onClick={e => { e.stopPropagation(); handleToggleStatus(); }}
                        aria-label={active ? t('common.mark_unavailable') : t('common.mark_available')}
                    >
                        <span role="img" aria-label="toggle">{active ? '✅' : '❌'}</span>
                    </button>
                </div>
            </div>

            {showDetails && (
                <div className="rental-card-modal" onClick={() => setShowDetails(false)} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(44,62,80,0.18)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="rental-card-modal-content" onClick={e => e.stopPropagation()} dir={isRTL ? 'rtl' : 'ltr'} style={{ background: '#fff', borderRadius: 18, padding: 32, maxWidth: 400, width: '90vw', boxShadow: '0 4px 32px rgba(38,166,154,0.18)', position: 'relative', fontFamily: 'Alef, Inter, sans-serif' }}>
                        <button onClick={() => setShowDetails(false)} style={{ position: 'absolute', top: 12, right: 12, background: '#ECEFF1', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, cursor: 'pointer' }} aria-label="close">✖️</button>
                        <h2 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 12px', color: '#1C2526', textAlign: isRTL ? 'right' : 'left' }}>{item.title}</h2>
                        <div style={{ width: 120, height: 120, borderRadius: 16, overflow: 'hidden', background: '#F4F6F8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
                            {Array.isArray(item.images) && item.images.length > 0 && item.images[0] ? (
                                <img
                                    src={`https://giveit-backend.onrender.com${item.images[0]}`}
                                    alt={item.title}
                                    style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 16 }}
                                    onError={e => { e.target.onerror = null; e.target.src = ''; e.target.parentNode.innerHTML = placeholderSVG; }}
                                />
                            ) : (
                                <span dangerouslySetInnerHTML={{ __html: placeholderSVG }} />
                            )}
                        </div>
                        <div style={{ fontSize: 15, color: '#607D8B', marginBottom: 10, textAlign: isRTL ? 'right' : 'left' }}><strong>{t('common.description')}:</strong> {item.description}</div>
                        <div style={{ fontSize: 15, color: '#607D8B', marginBottom: 6, textAlign: isRTL ? 'right' : 'left' }}><strong>{t('common.category')}:</strong> {item.category}</div>
                        <div style={{ fontSize: 15, color: '#607D8B', marginBottom: 6, textAlign: isRTL ? 'right' : 'left' }}><strong>{t('common.phone')}:</strong> {item.phone}</div>
                        <div style={{ fontSize: 15, color: '#607D8B', marginBottom: 6, textAlign: isRTL ? 'right' : 'left' }}><strong>{t('common.price')}:</strong> {item.price}₪ / {type === 'rental' ? t('common.per_day') : t('common.per_hour')}</div>
                        <div style={{ fontSize: 15, color: '#607D8B', marginBottom: 6, textAlign: isRTL ? 'right' : 'left' }}><strong>{t('common.city')}:</strong> {item.city}</div>
                        <div style={{ fontSize: 15, color: '#607D8B', marginBottom: 6, textAlign: isRTL ? 'right' : 'left' }}><strong>{t('common.street')}:</strong> {item.street}</div>
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
