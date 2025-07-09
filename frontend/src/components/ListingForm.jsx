import React, { useState } from 'react';
import { useAuthContext } from '../context/AuthContext';
import ImageUpload from './ImageUpload';

const ListingForm = ({ type = 'rental', onSuccess }) => {
  const { user } = useAuthContext();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    location: '',
    images: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleImageUpload = (imageUrls) => {
    setFormData(prev => ({
      ...prev,
      images: Array.isArray(imageUrls) ? imageUrls : [imageUrls]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.token) {
      setError('Please log in to create a listing');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const endpoint = type === 'rental' ? 'rentals' : 'services';
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://giveit-backend.onrender.com'}/api/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price)
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create listing');
      }

      const result = await response.json();
      onSuccess?.(result);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: '',
        price: '',
        location: '',
        images: []
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="listing-form">
      <h2>Create {type === 'rental' ? 'Rental' : 'Service'} Listing</h2>
      
      <form onSubmit={handleSubmit} className="form">
        <input
          name="title"
          type="text"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
          rows="4"
        />
        
        <input
          name="category"
          type="text"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          required
        />
        
        <input
          name="price"
          type="number"
          step="0.01"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
        />
        
        <input
          name="location"
          type="text"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          required
        />
        
        <div className="image-upload-section">
          <label>Images:</label>
          <ImageUpload onImageUpload={handleImageUpload} multiple={true} />
          {formData.images.length > 0 && (
            <div className="image-preview">
              {formData.images.map((url, index) => (
                <img 
                  key={index}
                  src={url} 
                  alt={`Preview ${index + 1}`}
                  style={{ width: '100px', height: '100px', objectFit: 'cover', margin: '5px' }}
                />
              ))}
            </div>
          )}
        </div>

        {error && <p className="error">{error}</p>}
        
        <button type="submit" disabled={loading} className="toggle-view-btn">
          {loading ? 'Creating...' : `Create ${type === 'rental' ? 'Rental' : 'Service'}`}
        </button>
      </form>
    </div>
  );
};

export default ListingForm;