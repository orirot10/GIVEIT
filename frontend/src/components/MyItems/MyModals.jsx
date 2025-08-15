import { useEffect, useState } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import ModalCard from './ModalCard';
import '../../styles/components/MyItems.css';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import EditModal from './EditModal';

const placeholderSVG = `<svg width='16' height='16' xmlns='http://www.w3.org/2000/svg'><rect width='16' height='16' rx='8' fill='#F4F6F8' stroke='#B0BEC5' stroke-width='2'/><rect x='12' y='24' width='12' height='8' rx='4' fill='#CFD8DC'/><rect x='12' y='12' width='12' height='6' rx='2' fill='#B0BEC5'/></svg>`;

const MyItemCard = ({ item, isRTL, view, t, setEditTarget, setDeleteTarget, placeholderSVG, onToggleStatus }) => {
    const [imgError, setImgError] = useState(false);
    let imageUrl = '';
    if (Array.isArray(item.images) && item.images.length > 0 && item.images[0]) {
        imageUrl = item.images[0].startsWith('http') ? item.images[0] : `https://giveit-backend.onrender.com${item.images[0]}`;
    }
    return (
        <div className="myitems-card" key={item._id} dir="ltr">
            <div className="myitems-card-imgwrap">
                {imageUrl && !imgError ? (
                    <img
                        src={imageUrl}
                        alt={item.title}
                        className="myitems-card-img"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <span dangerouslySetInnerHTML={{ __html: placeholderSVG }} />
                )}
            </div>
            <div className="myitems-card-content" style={isRTL ? { textAlign: 'right' } : undefined} dir={isRTL ? 'rtl' : 'ltr'}>
                <div className="myitems-card-title">{item.title}</div>
                <div className="myitems-card-meta" style={isRTL ? { textAlign: 'right' } : undefined}>
                    {item.status && (
                        <span >
                            ● {t(`common.${item.status}`)}
                        </span>
                    )}
                    {item.createdAt && <span>{format(new Date(item.createdAt), 'dd/MM/yyyy HH:mm')}</span>}</div>
                <div className="myitems-card-actions" style={isRTL ? { display: 'flex', justifyContent: 'flex-end' } : undefined}>
                {(view === 'rentals' || view === 'services') && (
                    <button className="myitems-status-btn" onClick={() => onToggleStatus(item, view)}>
                        {item.status === 'available' ? t('common.mark_unavailable') : t('common.mark_available')}
                    </button>
                )}
                <button className="myitems-edit-btn" onClick={() => setEditTarget({ item, type: view === 'rentals' ? 'rental' : view === 'services' ? 'service' : view === 'rental_requests' ? 'rental_request' : 'service_request' })}>
                    <span role="img" aria-label="edit">✏️</span>
                </button>
                <button className="myitems-delete-btn" onClick={() => setDeleteTarget({ item, type: view === 'rentals' ? 'rental' : view === 'services' ? 'service' : view === 'rental_requests' ? 'rental_request' : 'service_request' })}>
                    <span role="img" aria-label="delete">🗑</span>
                </button>
                </div>
            </div>
        </div>
    );
};

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
    const [editTarget, setEditTarget] = useState(null); // { item, type }
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

    const handleEditSave = async (updatedItem) => {
        if (!editTarget) return;
        const { item, type } = editTarget;
        let endpoint = '';
        if (type === 'rental') endpoint = 'rentals';
        else if (type === 'service') endpoint = 'services';
        else if (type === 'rental_request') endpoint = 'rental_requests';
        else if (type === 'service_request') endpoint = 'service_requests';
        try {
            const res = await fetch(`${baseUrl}/api/${endpoint}/${item._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify(updatedItem),
            });
            if (res.ok) {
                const data = await res.json();
                if (type === 'rental') setRentals(rentals.map(r => r._id === item._id ? data : r));
                else if (type === 'service') setServices(services.map(s => s._id === item._id ? data : s));
                else if (type === 'rental_request') setRentalRequests(rentalRequests.map(r => r._id === item._id ? data : r));
                else if (type === 'service_request') setServiceRequests(serviceRequests.map(s => s._id === item._id ? data : s));
            }
        } catch (err) {
            console.error('Edit failed:', err);
        } finally {
            setEditTarget(null);
        }
    };

    const handleToggleStatus = async (item, viewType) => {
        const type = viewType === 'rentals' ? 'rental' : 'service';
        const endpoint = type === 'rental' ? 'rentals' : 'services';
        const newStatus = item.status === 'available' ? 'not_available' : 'available';
        try {
            const res = await fetch(`${baseUrl}/api/${endpoint}/${item._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify({ status: newStatus }),
            });
            if (res.ok) {
                const data = await res.json();
                if (type === 'rental') setRentals(rentals.map(r => r._id === item._id ? data : r));
                else setServices(services.map(s => s._id === item._id ? data : s));
            }
        } catch (err) {
            console.error('Status update failed:', err);
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
            <h2 className="main-title">{t('my_items.title')}</h2>
            <div className="myitems-tabs" role="tablist">
                {TAB_CATEGORIES.map(tab => (
                    <button
                        key={tab.key}
                        className={`myitems-tab${view === tab.key ? ' active' : ''}`}
                        onClick={() => setView(tab.key)}
                       
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
                                <MyItemCard
                                    key={item._id}
                                    item={item}
                                    isRTL={isRTL}
                                    view={view}
                                    t={t}
                                    setEditTarget={setEditTarget}
                                    setDeleteTarget={setDeleteTarget}
                                    placeholderSVG={placeholderSVG}
                                    onToggleStatus={handleToggleStatus}
                                />
                            ))}
                        </div>
                    );
                })()}
            </div>
            {/* Add Listing Button */}
            {(view === 'rentals' || view === 'services') && (
                <button
                    className="myitems-add-btn"
                    onClick={() => navigate(view === 'rentals' ? '/offer-rental' : '/offer-service')}
                >
                    {view === 'rentals' ? t('rentals.add_rental') : t('services.add_service')}
                </button>
            )}
            {/* Add Request Buttons */}
            {view === 'rental_requests' && (
                <button
                    className="myitems-add-btn"
                    onClick={() => navigate('/request-rental')}
                >
                    {t('rentals.request_rental')}
                </button>
            )}
            {view === 'service_requests' && (
                <button
                    className="myitems-add-btn"
                    onClick={() => navigate('/request-service')}
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
            {editTarget && (
                <EditModal
                    item={editTarget.item}
                    type={editTarget.type === 'rental' || editTarget.type === 'rental_request' ? 'rental' : 'service'}
                    onSave={handleEditSave}
                    onCancel={() => setEditTarget(null)}
                />
            )}
        </div>
    );
};

export default MyModals;