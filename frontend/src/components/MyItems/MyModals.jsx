import { useEffect, useState } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import ModalCard from './ModalCard';
import '../../styles/components/MyItems.css';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import DeleteConfirmationModal from './DeleteConfirmationModal';

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
            <div className="myitems-tabs" role="tablist">
                {TAB_CATEGORIES.map(tab => (
                <button
                        key={tab.key}
                        className={`myitems-tab${view === tab.key ? ' active' : ''}`}
                        onClick={() => setView(tab.key)}
                        style={{ fontFamily: 'Alef, Inter, sans-serif', fontSize: 14, color: '#1C2526', borderRadius: 12, direction: isRTL ? 'rtl' : 'ltr' }}
                        role="tab"
                        aria-selected={view === tab.key}
                    >
                        {tab.label}
                </button>
                ))}
            </div>
            <div className="myitems-list-scroll">
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
                                        <img
                                            src={Array.isArray(item.images) && item.images.length > 0 ? `https://giveit-backend.onrender.com${item.images[0]}` : ''}
                                            alt={item.title}
                                            className="myitems-card-img"
                                            style={{ border: '2px solid #607D8B', borderRadius: 8, width: 64, height: 64, objectFit: 'cover', background: '#F4F6F8' }}
                                            onError={e => { e.target.src = ''; e.target.style.background = '#F4F6F8'; }}
                                        />
                                    </div>
                                    <div className="myitems-card-content">
                                        <div className="myitems-card-title" style={{ fontFamily: 'Alef, Inter, sans-serif', fontSize: 14, color: '#1C2526', direction: isRTL ? 'rtl' : 'ltr' }}>{item.title}</div>
                                        <div className="myitems-card-meta" style={{ fontFamily: 'Alef, Inter, sans-serif', fontSize: 12, color: '#607D8B', direction: isRTL ? 'rtl' : 'ltr' }}>
                                            {item.status && <span>{t('common.status')}: {t(`common.${item.status}`)}</span>}
                                            {item.createdAt && <span style={{ marginRight: 8 }}>{format(new Date(item.createdAt), 'dd/MM/yyyy HH:mm')}</span>}
                                        </div>
                                        <div className="myitems-card-actions">
                                            <button className="myitems-edit-btn" onClick={() => setView('edit')}>{t('common.edit')}</button>
                                            <button className="myitems-delete-btn" onClick={() => setDeleteTarget({ item, type: view === 'rentals' ? 'rental' : view === 'services' ? 'service' : view === 'rental_requests' ? 'rental_request' : 'service_request' })}>{t('common.delete')}</button>
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
                    {view === 'rentals' ? t('my_items.add_rental') : t('my_items.add_service')}
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
                    {t('my_items.add_rental_request')}
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
                    {t('my_items.add_service_request')}
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