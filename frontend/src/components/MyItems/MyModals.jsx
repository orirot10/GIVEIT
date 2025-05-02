import { useEffect, useState } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import ModalCard from './ModalCard';
import '../../styles/components/MyItems.css';

const MyModals = () => {
    const { user } = useAuthContext();
    const [rentals, setRentals] = useState([]);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('rentals'); // 'rentals' or 'services'

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }
        const fetchData = async () => {
            try {
                // Fetch rentals
                const rentalsRes = await fetch('http://localhost:5000/api/rentals/user', {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                const rentalsData = await rentalsRes.json();
                if (!rentalsRes.ok) throw new Error(rentalsData.error);
                setRentals(rentalsData);

                // Fetch services
                const servicesRes = await fetch('http://localhost:5000/api/services/user', {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                const servicesData = await servicesRes.json();
                if (!servicesRes.ok) throw new Error(servicesData.error);
                setServices(servicesData);
            } catch (err) {
                console.error('Failed to fetch data:', err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    const handleDeleteSuccess = (deletedId, type) => {
        if (type === 'rental') {
            setRentals(prev => prev.filter(item => item._id !== deletedId));
        } else {
            setServices(prev => prev.filter(service => service._id !== deletedId));
        }
    };

    const handleEditSuccess = (updatedItem, type) => {
        if (type === 'rental') {
            setRentals(prev =>
                prev.map(item => (item._id === updatedItem._id ? updatedItem : item))
            );
        } else {
            setServices(prev =>
                prev.map(service => (service._id === updatedItem._id ? updatedItem : service))
            );
        }
    };

    // Show message if not logged in
    if (!user) {
        return (
            <div className="my-items-container">
                <h2>My Rentals</h2>
                <p className="not-logged-in">You must be logged in to view your rentals.</p>
            </div>
        );
    }

    return (
        <div className="my-items-container">
            <h2>My {view === 'rentals' ? 'Rentals' : 'Services'}</h2>

            {/* View Toggle Switch */}
            <div className="view-switch-container">
                <span className={`view-label ${view === 'rentals' ? 'active' : ''}`}>Rentals</span>
                <label className="switch">
                    <input 
                        type="checkbox" 
                        checked={view === 'services'} 
                        onChange={() => setView(view === 'rentals' ? 'services' : 'rentals')}
                    />
                    <span className="slider round"></span>
                </label>
                <span className={`view-label ${view === 'services' ? 'active' : ''}`}>Services</span>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="items-list">
                    {view === 'rentals' ? (
                        rentals.length > 0 ? (
                            rentals.map(item => (
                                <ModalCard 
                                    key={item._id} 
                                    item={item} 
                                    type="rental"
                                    onDeleteSuccess={(id) => handleDeleteSuccess(id, 'rental')}
                                    onEditSuccess={(updatedItem) => handleEditSuccess(updatedItem, 'rental')}
                                />
                            ))
                        ) : (
                            <div className="services-placeholder">
                                <p>You haven't offered any rentals yet</p>
                                <a href="/offer-rental" className="btn-offer">
                                    Offer a Rental
                                </a>
                            </div>
                        )
                    ) : (
                        services.length > 0 ? (
                            services.map(service => (
                                <ModalCard 
                                    key={service._id} 
                                    item={service} 
                                    type="service"
                                    onDeleteSuccess={(id) => handleDeleteSuccess(id, 'service')}
                                    onEditSuccess={(updatedItem) => handleEditSuccess(updatedItem, 'service')}
                                />
                            ))
                        ) : (
                            <div className="services-placeholder">
                                <p>You haven't offered any services yet</p>
                                <a href="/offer-service" className="btn-offer">
                                    Offer a Service
                                </a>
                            </div>
                        )
                    )}
                </div>
            )}
        </div>
    );
};

export default MyModals;