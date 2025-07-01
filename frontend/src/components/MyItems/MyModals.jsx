import { useEffect, useState } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import ModalCard from './ModalCard';
import '../../styles/components/MyItems.css';
import { format } from 'date-fns';

const MyModals = () => {
    const { user } = useAuthContext();
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'he';
    const [rentals, setRentals] = useState([]);
    const [services, setServices] = useState([]);
    const [rentalRequests, setRentalRequests] = useState([]);
    const [serviceRequests, setServiceRequests] = useState([]);
    const [view, setView] = useState('rentals'); // 'rentals', 'services', 'rental_requests', 'service_requests'
    const baseUrl = import.meta.env.VITE_API_URL || 'https://giveit-backend.onrender.com';

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
                                            <button className="myitems-delete-btn" onClick={() => setView('delete')}>{t('common.delete')}</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    );
                })()}
            </div>
        </div>
    );
};

export default MyModals;