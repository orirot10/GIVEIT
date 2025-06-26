import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import ModalCard from './ModalCard';
import '../../styles/components/MyItems.css';

const MyModals = () => {
    const navigate = useNavigate();
    const { user } = useAuthContext();
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'he';
    const [rentals, setRentals] = useState([]);
    const [services, setServices] = useState([]);
    const [rentalRequests, setRentalRequests] = useState([]);
    const [serviceRequests, setServiceRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('rentals'); // 'rentals', 'services', 'rental_requests', 'service_requests'
    const baseUrl = import.meta.env.VITE_API_URL || 'https://giveit-backend.onrender.com';

    useEffect(() => {
        if (!user) {
            setLoading(false);
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
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user, baseUrl]);

    const handleDeleteSuccess = (deletedId, type) => {
        switch (type) {
            case 'rental':
                setRentals(prev => prev.filter(item => item._id !== deletedId));
                break;
            case 'service':
                setServices(prev => prev.filter(service => service._id !== deletedId));
                break;
            case 'rental_request':
                setRentalRequests(prev => prev.filter(request => request._id !== deletedId));
                break;
            case 'service_request':
                setServiceRequests(prev => prev.filter(request => request._id !== deletedId));
                break;
        }
    };

    const handleEditSuccess = (updatedItem, type) => {
        switch (type) {
            case 'rental':
                setRentals(prev =>
                    prev.map(item => (item._id === updatedItem._id ? updatedItem : item))
                );
                break;
            case 'service':
                setServices(prev =>
                    prev.map(service => (service._id === updatedItem._id ? updatedItem : service))
                );
                break;
            case 'rental_request':
                setRentalRequests(prev =>
                    prev.map(request => (request._id === updatedItem._id ? updatedItem : request))
                );
                break;
            case 'service_request':
                setServiceRequests(prev =>
                    prev.map(request => (request._id === updatedItem._id ? updatedItem : request))
                );
                break;
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

    const getDisplayTitle = () => {
        switch (view) {
            case 'rentals':
                return t('my_items.my_rentals');
            case 'services':
                return t('my_items.my_services');
            case 'rental_requests':
                return t('my_items.my_rental_requests');
            case 'service_requests':
                return t('my_items.my_service_requests');
            default:
                return t('my_items.title');
        }
    };

    const getItems = () => {
        switch (view) {
            case 'rentals':
                return rentals;
            case 'services':
                return services;
            case 'rental_requests':
                return rentalRequests;
            case 'service_requests':
                return serviceRequests;
            default:
                return [];
        }
    };

    const getItemType = () => {
        switch (view) {
            case 'rentals':
                return 'rental';
            case 'services':
                return 'service';
            case 'rental_requests':
                return 'rental_request';
            case 'service_requests':
                return 'service_request';
            default:
                return 'rental';
        }
    };

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

    const getActionButton = () => {
        switch (view) {
            case 'rentals':
                return {
                    text: t('my_items.offer_rental'),
                    path: '/offer-rental'
                };
            case 'services':
                return {
                    text: t('my_items.offer_service'),
                    path: '/offer-service'
                };
            case 'rental_requests':
                return {
                    text: t('my_items.request_rental'),
                    path: '/request-rental'
                };
            case 'service_requests':
                return {
                    text: t('my_items.request_service'),
                    path: '/request-service'
                };
            default:
                return null;
        }
    };

    return (
        <div className="my-items-container" dir={isRTL ? 'rtl' : 'ltr'}>
            <h2>{getDisplayTitle()}</h2>

            {/* View Toggle Switch */}
            <div className="view-switch-container">
                <button
                    className={`view-button ${view === 'rentals' ? 'active' : ''}`}
                    onClick={() => setView('rentals')}
                >
                    {t('my_items.rentals')}
                </button>
                <button
                    className={`view-button ${view === 'services' ? 'active' : ''}`}
                    onClick={() => setView('services')}
                >
                    {t('my_items.services')}
                </button>
                <button
                    className={`view-button ${view === 'rental_requests' ? 'active' : ''}`}
                    onClick={() => setView('rental_requests')}
                >
                    {t('my_items.rental_requests')}
                </button>
                <button
                    className={`view-button ${view === 'service_requests' ? 'active' : ''}`}
                    onClick={() => setView('service_requests')}
                >
                    {t('my_items.service_requests')}
                </button>
            </div>

            {loading ? (
                <p>{t('common.loading')}</p>
            ) : (
                <div className="items-list">
                    {getItems().length > 0 ? (
                        getItems().map(item => (
                            <ModalCard
                                key={item._id}
                                item={item}
                                type={getItemType()}
                                onDeleteSuccess={handleDeleteSuccess}
                                onEditSuccess={handleEditSuccess}
                            />
                        ))
                    ) : (
                        <div className="empty-state">
                            <p>{getEmptyMessage()}</p>
                            {getActionButton() && (
                                <button
                                    className="btn-offer"
                                    onClick={() => navigate(getActionButton().path)}
                                >
                                    {getActionButton().text}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Persistent Add Listing Button */}
            <button
                className="add-listing-fab"
                onClick={() => navigate(getActionButton()?.path || '/offer-rental')}
            >
                {t('my_items.add_listing')}
            </button>
        </div>
    );
};

export default MyModals;