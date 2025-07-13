import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapIcon, MagnifyingGlassIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import Popup from '../components/Shared/Popup';
import { usePricePeriodTranslation } from '../utils/pricePeriodTranslator';

const categories = [
  { id: 'tools', name: 'Tools', icon: '🔧' },
  { id: 'vehicles', name: 'Vehicles', icon: '🚗' },
  { id: 'electronics', name: 'Electronics', icon: '💻' },
  { id: 'sports', name: 'Sports', icon: '⚽' },
  { id: 'clothing', name: 'Clothing', icon: '👕' },
  { id: 'other', name: 'Other', icon: '📦' }
];

const Home = () => {
  const navigate = useNavigate();
  const { translatePricePeriod } = usePricePeriodTranslation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    location: '',
    priceRange: { min: '', max: '' },
    availabilityDate: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      
      // Use a timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://giveit-backend.onrender.com'}/api/rentals`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      // Ensure every item has a phone field
      setItems(data.map(item => ({
        ...item,
        phone: item.phone || item.ownerPhone || 'Contact Info Unavailable'
      })));
    } catch (error) {
      console.error('Error fetching items:', error);
      // Use mock data when API is unavailable
      setItems([
        {
          _id: '1',
          title: 'Power Drill',
          description: 'Professional power drill, barely used',
          category: 'tools',
          price: 15,
          pricePeriod: 'day',
          images: [],
          phone: '555-1234',
          status: 'available',
          city: 'Tel Aviv',
          street: 'Rothschild Blvd'
        },
        {
          _id: '2',
          title: 'Mountain Bike',
          description: 'Trek mountain bike in excellent condition',
          category: 'sports',
          price: 25,
          pricePeriod: 'day',
          images: [],
          phone: '555-5678',
          status: 'available',
          city: 'Jerusalem',
          street: 'Jaffa St'
        }
      ].map(item => ({
        ...item,
        phone: item.phone || item.ownerPhone || 'Contact Info Unavailable'
      })));
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      priceRange: {
        ...prev.priceRange,
        [name]: value
      }
    }));
  };

  const filteredItems = items.filter(item => {
    return (
      (!filters.category || item.category === filters.category) &&
      (!filters.location || item.city.toLowerCase().includes(filters.location.toLowerCase())) &&
      (!filters.priceRange.min || item.price >= Number(filters.priceRange.min)) &&
      (!filters.priceRange.max || item.price <= Number(filters.priceRange.max))
    );
  });

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: 'Heebo, Arial, sans-serif' }}>
      {/* Search and Filter Section */}
      <div className="sticky top-0 z-10 bg-white shadow-md p-2">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search items..."
                className="w-full pl-8 pr-3 py-1.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <MagnifyingGlassIcon className="h-4 w-4 text-gray-400 absolute left-2.5 top-1/2 transform -translate-y-1/2" />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-1.5 hover:bg-gray-100 rounded-lg"
            >
              <AdjustmentsHorizontalIcon className="h-5 w-5 text-gray-600" />
            </button>
            <button
              onClick={() => navigate('/map')}
              className="p-1.5 hover:bg-gray-100 rounded-lg"
            >
              <MapIcon className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-2 grid grid-cols-1 md:grid-cols-4 gap-2">
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="p-1.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                name="location"
                placeholder="Location"
                value={filters.location}
                onChange={handleFilterChange}
                className="p-1.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex gap-1.5">
                <input
                  type="number"
                  name="min"
                  placeholder="Min Price"
                  value={filters.priceRange.min}
                  onChange={handlePriceChange}
                  className="w-full p-1.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  name="max"
                  placeholder="Max Price"
                  value={filters.priceRange.max}
                  onChange={handlePriceChange}
                  className="w-full p-1.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <input
                type="date"
                name="availabilityDate"
                value={filters.availabilityDate}
                onChange={handleFilterChange}
                className="p-1.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </div>
      </div>

      {/* Items Grid */}
      <div className="max-w-7xl mx-auto p-4">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item._id}
                onClick={() => setSelectedItem(item)}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={item.images?.[0] ? `${import.meta.env.VITE_API_URL}${item.images[0]}` : '/placeholder.jpg'}
                    alt={item.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/placeholder.jpg';
                    }}
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{categories.find((c) => c.id === item.category)?.icon}</span>
                    <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{item.description.substring(0,
                    100)}...</p>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-600 font-semibold">${item.price}/{translatePricePeriod(item.pricePeriod)}</span>
                    <span className="text-sm text-gray-500">{item.city}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Item Popup */}
      {selectedItem && (
        <Popup
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
};

export default Home;