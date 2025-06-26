import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageUpload from '../ImageUpload';
import '../../styles/components/UploadForm.css';
import { geocodeAddress } from '../HomePage/geocode';

const ModalUploadForm = ({
titleText,
categories,
submitUrl,
successMessage,
submitButtonText,
user,
}) => {
const navigate = useNavigate();

const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    pricePeriod: 'use',
    firstName: user?.user?.firstName || user?.user?.displayName?.split(' ')[0] || '',
    lastName: user?.user?.lastName || user?.user?.displayName?.split(' ')[1] || '',
    phone: user?.user?.phone || '',
    city: user?.user?.city || '',
    street: user?.user?.street || ''
});

const [imageUrls, setImageUrls] = useState([]);
const [success, setSuccess] = useState(false);
const [error, setError] = useState(null);
const [isSubmitting, setIsSubmitting] = useState(false);


const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
};

const handleImageUpload = (urls) => {
    setImageUrls(urls.slice(0, 5)); // Limit to 5 images
};

const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
        if (!user) {
            throw new Error('You must be logged in to create a listing');
        }

        // Get Firebase Auth token
        const { getAuth } = await import('firebase/auth');
        const auth = getAuth();
        const currentUser = auth.currentUser;
        
        if (!currentUser) {
            throw new Error('Authentication error: No current user');
        }

        const token = await currentUser.getIdToken(true);

        // Geocode address
        const coords = await geocodeAddress(form.street, form.city);
        // Prepare listing data with Firebase image URLs and lat/lng
        const listingData = {
            ...form,
            images: imageUrls,
            lat: coords ? coords.lat : undefined,
            lng: coords ? coords.lng : undefined,
            ownerId: currentUser.uid
        };
        
        // Send to MongoDB via backend API
        const res = await fetch(submitUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(listingData)
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error || `HTTP error! status: ${res.status}`);
        }

        setSuccess(true);
    } catch (err) {
        console.error('Submission error:', err);
        setError(err.message || 'Failed to submit form');
    } finally {
        setIsSubmitting(false);
    }
};

return (
    <div className="upload-form-container">
        {success ? (
            <div className="alert alert-success shadow-lg flex flex-col items-center">
                <span className="text-lg font-semibold">{successMessage}</span>
                <button className="btn btn-primary mt-4" onClick={() => navigate('/')}>Close</button>
            </div>
        ) : (
            <>
                <h2 className="text-xl font-bold mb-4 text-center">{titleText}</h2>
                {error && (
                    <div className="alert alert-error mb-4">
                        <span>{error}</span>
                    </div>
                )}
                <form onSubmit={handleSubmit} className="upload-form space-y-4" encType="multipart/form-data">
                    <div className="form-group">
                        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} className="input input-bordered w-full" required />
                    </div>
                    <div className="form-group">
                        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="textarea textarea-bordered w-full" required />
                    </div>
                    <div className="form-group">
                        <select name="category" value={form.category} onChange={handleChange} className="select select-bordered w-full" required>
                            <option value="">Select category</option>
                            {categories.map((cat, index) => <option key={index} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} className="input input-bordered w-full" required />
                    </div>
                    <div className="form-group">
                        <select name="pricePeriod" value={form.pricePeriod} onChange={handleChange} className="select select-bordered w-full">
                            <option value="use">Per Use</option>
                            <option value="hour">Per Hour</option>
                            <option value="day">Per Day</option>
                            <option value="week">Per Week</option>
                            <option value="month">Per Month</option>
                        </select>
                    </div>

                    {/* Image upload */}
                    <div className="form-group">
                        <label className="block text-sm font-medium mb-2">Images (up to 5)</label>
                        <ImageUpload 
                            onImageUpload={handleImageUpload}
                            multiple={true}
                            accept="image/*"
                        />
                        {imageUrls.length > 0 && (
                            <div className="mt-2">
                                <p className="text-sm text-gray-600">{imageUrls.length} image(s) uploaded</p>
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <input name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} className="input input-bordered w-full" required />
                    </div>
                    <div className="form-group">
                        <input name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} className="input input-bordered w-full" required />
                    </div>
                    <div className="form-group">
                        <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} className="input input-bordered w-full" required />
                    </div>
                    <div className="form-group">
                        <input name="city" placeholder="City" value={form.city} onChange={handleChange} className="input input-bordered w-full" required />
                    </div>
                    <div className="form-group">
                        <input name="street" placeholder="Street" value={form.street} onChange={handleChange} className="input input-bordered w-full" required />
                    </div>

                    <div className="button-group flex justify-center gap-4 mt-6">
                        <button type="submit" className="btn btn-primary px-6" disabled={isSubmitting}>
                            {isSubmitting ? 'Submitting...' : submitButtonText}
                        </button>
                        <button type="button" className="btn btn-outline px-6" onClick={() => navigate('/dashboard')}>Cancel</button>
                    </div>
                </form>
            </>
        )}
    </div>
);
};

export default ModalUploadForm;