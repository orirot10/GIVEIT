import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import ModalCard from './ModalCard';
import '../../styles/components/MyItems.css';

const MyModals = () => {
    const navigate = useNavigate();
    const { user } = useAuthContext();
    const [rentals, setRentals] = useState([]);
    const [services, setServices] = useState([]);
    const [rentalRequests, setRentalRequests] = useState([]);
    const [serviceRequests, setServiceRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('rentals'); // 'rentals', 'services', 'rental_requests', 'service_requests'

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }
        const fetchData = async () => {
            try {
                // Fetch rentals
                const rentalsRes = await fetch('https://giveit-backend.onrender.com/api/rentals/user', {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                const rentalsData = await rentalsRes.json();
                if (!rentalsRes.ok) throw new Error(rentalsData.error);
                setRentals(rentalsData);

                // Fetch services
                const servicesRes = await fetch('https://giveit-backend.onrender.com/api/services/user', {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                const servicesData = await servicesRes.json();
                if (!servicesRes.ok) throw new Error(servicesData.error);
                setServices(servicesData);

                // Fetch rental requests
                const rentalRequestsRes = await fetch('https://giveit-backend.onrender.com/api/rental_requests/user', {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                const rentalRequestsData = await rentalRequestsRes.json();
                if (!rentalRequestsRes.ok) throw new Error(rentalRequestsData.error);
                setRentalRequests(rentalRequestsData);

                // Fetch service requests
                const serviceRequestsRes = await fetch('https://giveit-backend.onrender.com/api/service_requests/user', {
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
    }, [user]);

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
            <div className="my-items-container">
                <h2>My Items</h2>
                <p className="not-logged-in">You must be logged in to view your items.</p>
            </div>
        );
    }

    const getDisplayTitle = () => {
        switch (view) {
            case 'rentals':
                return 'My Rentals';
            case 'services':
                return 'My Services';
            case 'rental_requests':
                return 'My Rental Requests';
            case 'service_requests':
                return 'My Service Requests';
            default:
                return 'My Items';
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
                return "You haven't offered any rentals yet";
            case 'services':
                return "You haven't offered any services yet";
            case 'rental_requests':
                return "You haven't made any rental requests yet";
            case 'service_requests':
                return "You haven't made any service requests yet";
            default:
                return "You haven't added any items yet";
        }
    };

    const getActionButton = () => {
        switch (view) {
            case 'rentals':
                return {
                    text: 'Offer a Rental',
                    path: '/offer-rental'
                };
            case 'services':
                return {
                    text: 'Offer a Service',
                    path: '/offer-service'
                };
            case 'rental_requests':
                return {
                    text: 'Request a Rental',
                    path: '/request-rental'
                };
            case 'service_requests':
                return {
                    text: 'Request a Service',
                    path: '/request-service'
                };
            default:
                return null;
        }
    };

    return (
        <div className="my-items-container">
            <h2>{getDisplayTitle()}</h2>

            {/* View Toggle Switch */}
            <div className="view-switch-container">
                <button
                    className={`view-button ${view === 'rentals' ? 'active' : ''}`}
                    onClick={() => setView('rentals')}
                >
                    Rentals
                </button>
                <button
                    className={`view-button ${view === 'services' ? 'active' : ''}`}
                    onClick={() => setView('services')}
                >
                    Services
                </button>
                <button
                    className={`view-button ${view === 'rental_requests' ? 'active' : ''}`}
                    onClick={() => setView('rental_requests')}
                >
                    Rental Requests
                </button>
                <button
                    className={`view-button ${view === 'service_requests' ? 'active' : ''}`}
                    onClick={() => setView('service_requests')}
                >
                    Service Requests
                </button>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="items-list">
                    {getItems().length > 0 ? (
                        getItems().map(item => (
                            <ModalCard 
                                key={item._id} 
                                item={item} 
                                type={getItemType()}
                                onDeleteSuccess={(id) => handleDeleteSuccess(id, getItemType())}
                                onEditSuccess={(updatedItem) => handleEditSuccess(updatedItem, getItemType())}
                            />
                        ))
                    ) : (
                        <div className="services-placeholder">
                            <p>{getEmptyMessage()}</p>
                            {getActionButton() && (
                                <button 
                                    onClick={() => navigate(getActionButton().path)} 
                                    className="btn-offer"
                                >
                                    {getActionButton().text}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MyModals;