import { useEffect, useState } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import ModalCard from './ModalCard';
import '../../styles/components/MyItems.css';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import DeleteConfirmationModal from './DeleteConfirmationModal';

const placeholderSVG = `<svg width='64' height='64' xmlns='http://www.w3.org/2000/svg'><rect width='64' height='64' rx='8' fill='#F4F6F8' stroke='#B0BEC5' stroke-width='2'/><rect x='12' y='24' width='40' height='24' rx='4' fill='#CFD8DC'/><rect x='20' y='32' width='24' height='8' rx='2' fill='#B0BEC5'/></svg>`;

const MyModals = () => {
    const { user } = useAuthContext();
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'he';
    const [rentals, setRentals] = useState([]);
    const [services, setServices] = useState([]);
    const [rentalRequests, setRentalRequests] = useState([]);
    const [serviceRequests, setServiceRequests] = useState([]);
    const [view, setView] = useState('rentals'); // 'rentals', 'services', 'rental_requests', 'service_requests'
    const [deleteTarget, setDeleteTarget] = useState(null); // { item, type }
    const baseUrl = import.meta.env.VITE_API_URL || 'https://giveit-backend.onrender.com';
    const navigate = useNavigate();

    const TAB_CATEGORIES = [
        { key: 'rentals', label: t('my_items.my_rentals') },
        { key: 'rental_requests', label: t('my_items.my_rental_requests') },
        { key: 'services', label: t('my_items.my_services') },
        { key: 'service_requests', label: t('my_items.my_service_requests') },
    ];

    useEffect(() => {
        if (!user) {
            return;
        }
        const fetchData = async () => {
            try {
                // Fetch rentals
                const rentalsRes = await fetch(`${baseUrl}/api/rentals/user`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                const rentalsData = await rentalsRes.json();
                if (!rentalsRes.ok) throw new Error(rentalsData.error);
                setRentals(rentalsData);

                // Fetch services
                const servicesRes = await fetch(`${baseUrl}/api/services/user`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                const servicesData = await servicesRes.json();
                if (!servicesRes.ok) throw new Error(servicesData.error);
                setServices(servicesData);

                // Fetch rental requests
                const rentalRequestsRes = await fetch(`${baseUrl}/api/rental_requests/user`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                const rentalRequestsData = await rentalRequestsRes.json();
                if (!rentalRequestsRes.ok) throw new Error(rentalRequestsData.error);
                setRentalRequests(rentalRequestsData);

                // Fetch service requests
                const serviceRequestsRes = await fetch(`${baseUrl}/api/service_requests/user`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                const serviceRequestsData = await serviceRequestsRes.json();
                if (!serviceRequestsRes.ok) throw new Error(serviceRequestsData.error);
                setServiceRequests(serviceRequestsData);
            } catch (err) {
                console.error('Failed to fetch data:', err.message);
            }
        };

        fetchData();
    }, [user, baseUrl]);

    const handleDelete = async () => {
        if (!deleteTarget) return;
        const { item, type } = deleteTarget;
        let endpoint = '';
        if (type === 'rental') endpoint = 'rentals';
        else if (type === 'service') endpoint = 'services';
        else if (type === 'rental_request') endpoint = 'rental_requests';
        else if (type === 'service_request') endpoint = 'service_requests';
        try {
            const res = await fetch(`${baseUrl}/api/${endpoint}/${item._id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            if (res.ok) {
                if (type === 'rental') setRentals(rentals.filter(r => r._id !== item._id));
                else if (type === 'service') setServices(services.filter(s => s._id !== item._id));
                else if (type === 'rental_request') setRentalRequests(rentalRequests.filter(r => r._id !== item._id));
                else if (type === 'service_request') setServiceRequests(serviceRequests.filter(s => s._id !== item._id));
            }
        } catch (err) {
            console.error('Delete failed:', err);
        } finally {
            setDeleteTarget(null);
        }
    };

    // Show message if not logged in
    if (!user) {
        return (
            <div className="my-items-container" dir={isRTL ? 'rtl' : 'ltr'}>
                <h2>{t('my_items.title')}</h2>
                <p className="not-logged-in">{t('my_items.login_required')}</p>
            </div>
        );
    }

    const getEmptyMessage = () => {
        switch (view) {
            case 'rentals':
                return t('my_items.no_rentals');
            case 'services':
                return t('my_items.no_services');
            case 'rental_requests':
                return t('my_items.no_rental_requests');
            case 'service_requests':
                return t('my_items.no_service_requests');
            default:
                return t('my_items.no_items');
        }
    };

    return (
        <div className="my-items-container" dir={isRTL ? 'rtl' : 'ltr'}>
            <h2>{t('my_items.title')}</h2>
            <div className="myitems-tabs" role="tablist" style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 20, overflowX: 'auto', maxWidth: 420, marginLeft: 'auto', marginRight: 'auto' }}>
                {TAB_CATEGORIES.map(tab => (
                    <button
                        key={tab.key}
                        className={`myitems-tab${view === tab.key ? ' active' : ''}`}
                        onClick={() => setView(tab.key)}
                        style={{
                            fontFamily: 'Alef, Inter, sans-serif',
                            fontSize: 13,
                            color: view === tab.key ? '#26A69A' : '#1C2526',
                            fontWeight: view === tab.key ? 'bold' : 'normal',
                            borderRadius: 10,
                            direction: isRTL ? 'rtl' : 'ltr',
                            background: 'none',
                            border: 'none',
                            padding: '8px 14px',
                            cursor: 'pointer',
                            position: 'relative',
                            outline: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minWidth: 80,
                            maxWidth: 120,
                            whiteSpace: 'nowrap',
                        }}
                        role="tab"
                        aria-selected={view === tab.key}
                    >
                        {view === tab.key && (
                            <span style={{ marginRight: isRTL ? 0 : 6, marginLeft: isRTL ? 6 : 0, color: '#26A69A', fontSize: 16 }}>●</span>
                        )}
                        {tab.label}
                        {view === tab.key && (
                            <span style={{
                                position: 'absolute',
                                left: 0,
                                right: 0,
                                bottom: 0,
                                height: 2,
                                background: '#26A69A',
                                borderRadius: 2,
                                width: '80%',
                                margin: '0 auto',
                                display: 'block',
                                content: '""',
                            }} />
                        )}
                    </button>
                ))}
            </div>
            <div className="myitems-list-scroll" style={{ maxWidth: 420, margin: '0 auto' }}>
                {(() => {
                    const items =
                        view === 'rentals' ? rentals :
                        view === 'services' ? services :
                        view === 'rental_requests' ? rentalRequests :
                        view === 'service_requests' ? serviceRequests : [];
                    return items.length === 0 ? (
                        <div className="services-placeholder">{getEmptyMessage()}</div>
                    ) : (
                        <div className="myitems-card-list">
                            {items.map(item => (
                                <div className="myitems-card" key={item._id} dir={isRTL ? 'rtl' : 'ltr'}>
                                    <div className="myitems-card-imgwrap">
                                        {Array.isArray(item.images) && item.images.length > 0 && item.images[0] ? (
                                            <img
                                                src={`https://giveit-backend.onrender.com${item.images[0]}`}
                                                alt={item.title}
                                                className="myitems-card-img"
                                                style={{ border: '2px solid #607D8B', borderRadius: 8, width: 64, height: 64, objectFit: 'cover', background: '#F4F6F8' }}
                                                onError={e => { e.target.onerror = null; e.target.src = ''; e.target.style.background = '#F4F6F8'; e.target.parentNode.innerHTML = placeholderSVG; }}
                                            />
                                        ) : (
                                            <span dangerouslySetInnerHTML={{ __html: placeholderSVG }} />
                                        )}
                                    </div>
                                    <div className="myitems-card-content">
                                        <div className="myitems-card-title" style={{ fontFamily: 'Alef, Inter, sans-serif', fontSize: 15, color: '#1C2526', direction: isRTL ? 'rtl' : 'ltr', textAlign: isRTL ? 'right' : 'left', fontWeight: 600 }}>{item.title}</div>
                                        <div className="myitems-card-meta" style={{ fontFamily: 'Alef, Inter, sans-serif', fontSize: 13, color: '#607D8B', direction: isRTL ? 'rtl' : 'ltr', textAlign: isRTL ? 'right' : 'left', display: 'flex', alignItems: 'center', gap: 8 }}>
                                            {item.status && (
                                                <span style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    background: item.status === 'active' ? '#C8E6C9' : item.status === 'expired' ? '#ECEFF1' : '#FFE0B2',
                                                    color: item.status === 'active' ? '#388E3C' : item.status === 'expired' ? '#607D8B' : '#FFA000',
                                                    borderRadius: 8,
                                                    padding: '2px 8px',
                                                    fontSize: 12,
                                                    fontWeight: 500,
                                                    marginRight: isRTL ? 0 : 8,
                                                    marginLeft: isRTL ? 8 : 0,
                                                }}>
                                                    ● {t(`common.${item.status}`)}
                                                </span>
                                            )}
                                            {item.createdAt && <span>{format(new Date(item.createdAt), 'dd/MM/yyyy HH:mm')}</span>}
                                        </div>
                                        <div className="myitems-card-actions" style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                                            <button className="myitems-edit-btn" style={{ fontSize: 14, display: 'flex', alignItems: 'center', gap: 4 }} onClick={() => setView('edit')}>
                                                <span role="img" aria-label="edit">✏️</span> {t('common.edit')}
                                            </button>
                                            <button className="myitems-delete-btn" style={{ fontSize: 14, display: 'flex', alignItems: 'center', gap: 4 }} onClick={() => setDeleteTarget({ item, type: view === 'rentals' ? 'rental' : view === 'services' ? 'service' : view === 'rental_requests' ? 'rental_request' : 'service_request' })}>
                                                <span role="img" aria-label="delete">🗑</span> {t('common.delete')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    );
                })()}
            </div>
            {/* Add Listing Button */}
            {(view === 'rentals' || view === 'services') && (
                <button
                    className="myitems-add-btn"
                    style={{
                        marginTop: 24,
                        padding: '12px 24px',
                        background: '#26A69A',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 8,
                        fontFamily: 'Alef, Inter, sans-serif',
                        fontSize: 16,
                        cursor: 'pointer',
                        width: '100%',
                        maxWidth: 320,
                        alignSelf: 'center',
                        boxShadow: '0 2px 8px rgba(38, 166, 154, 0.08)'
                    }}
                    onClick={() => navigate(view === 'rentals' ? '/offer-rental' : '/offer-service')}
                    onMouseOver={e => e.currentTarget.style.background = '#FFCA28'}
                    onMouseOut={e => e.currentTarget.style.background = '#26A69A'}
                >
                    {view === 'rentals' ? t('rentals.add_rental') : t('services.add_service')}
                </button>
            )}
            {/* Add Request Buttons */}
            {view === 'rental_requests' && (
                <button
                    className="myitems-add-btn"
                    style={{
                        marginTop: 24,
                        padding: '12px 24px',
                        background: '#26A69A',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 8,
                        fontFamily: 'Alef, Inter, sans-serif',
                        fontSize: 16,
                        cursor: 'pointer',
                        width: '100%',
                        maxWidth: 320,
                        alignSelf: 'center',
                        boxShadow: '0 2px 8px rgba(38, 166, 154, 0.08)'
                    }}
                    onClick={() => navigate('/request-rental')}
                    onMouseOver={e => e.currentTarget.style.background = '#FFCA28'}
                    onMouseOut={e => e.currentTarget.style.background = '#26A69A'}
                >
                    {t('rentals.request_rental')}
                </button>
            )}
            {view === 'service_requests' && (
                <button
                    className="myitems-add-btn"
                    style={{
                        marginTop: 24,
                        padding: '12px 24px',
                        background: '#26A69A',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 8,
                        fontFamily: 'Alef, Inter, sans-serif',
                        fontSize: 16,
                        cursor: 'pointer',
                        width: '100%',
                        maxWidth: 320,
                        alignSelf: 'center',
                        boxShadow: '0 2px 8px rgba(38, 166, 154, 0.08)'
                    }}
                    onClick={() => navigate('/request-service')}
                    onMouseOver={e => e.currentTarget.style.background = '#FFCA28'}
                    onMouseOut={e => e.currentTarget.style.background = '#26A69A'}
                >
                    {t('services.request_service')}
                </button>
            )}
            {deleteTarget && (
                <DeleteConfirmationModal
                    onConfirm={handleDelete}
                    onCancel={() => setDeleteTarget(null)}
                />
            )}
        </div>
    );
};

export default MyModals;