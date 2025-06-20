import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase';
import '../../styles/components/UploadForm.css';

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
    phone: user?.user?.phone || '',
    city: user?.user?.city || '',
    street: user?.user?.street || ''
});

const [images, setImages] = useState([]);
const [success, setSuccess] = useState(false);
const [error, setError] = useState(null);
const [isSubmitting, setIsSubmitting] = useState(false);
const [isUploading, setIsUploading] = useState(false);

const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
};

const handleFileChange = e => {
    const files = Array.from(e.target.files).slice(0, 5); // Limit to 5 files
    setImages(files);
};

const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    setIsUploading(false);

    try {
        // Check if user is authenticated
        if (!user) {
            throw new Error('You must be logged in to create a listing');
        }

        // Get fresh token from Firebase Auth
        let token;
        try {
            const { getAuth } = await import('firebase/auth');
            const auth = getAuth();
            const currentUser = auth.currentUser;
            
            if (currentUser) {
                token = await currentUser.getIdToken(true);
                console.log('Retrieved fresh token from Firebase');
            } else {
                console.error('No current user in Firebase Auth');
                throw new Error('Authentication error: No current user');
            }
        } catch (tokenError) {
            console.error('Failed to get token:', tokenError);
            throw new Error('Authentication error: Failed to get token');
        }
        
        if (!token) {
            throw new Error('Authentication token is missing. Please log out and log in again.');
        }
        
        // 1. Upload images to Firebase Storage
        const imageUrls = [];
        
        if (images.length > 0) {
            setIsUploading(true);
            for (const file of images) {
                const fileName = `listings/${Date.now()}_${file.name}`;
                const storageRef = ref(storage, fileName);
                
                // Upload file
                await uploadBytes(storageRef, file);
                
                // Get download URL
                const downloadUrl = await getDownloadURL(storageRef);
                imageUrls.push(downloadUrl);
            }
            setIsUploading(false);
        }
        
        // 2. Prepare data for API
        const listingData = {
            ...form,
            images: imageUrls
        };
        
        // 3. Send data to backend
        // Extract the base URL from submitUrl (remove '/with-urls' if present)
        const baseApiUrl = submitUrl.replace('/with-urls', '');
        
        console.log('Submitting to endpoint:', baseApiUrl);
        console.log('With token:', token.substring(0, 10) + '...');
        
        const res = await fetch(baseApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(listingData)
        });

        // Parse response
        let data;
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            data = await res.json();
        } else {
            const text = await res.text();
            console.error('Server returned non-JSON response:', text);
            throw new Error(`Server returned an invalid response (${res.status}): ${text.substring(0, 100)}`);
        }

        if (!res.ok) {
            throw new Error(data.error || `HTTP error! status: ${res.status}`);
        }

        setSuccess(true);
    } catch (err) {
        console.error('Submission error:', err);
        setError(err.message || 'Failed to submit form');
    } finally {
        setIsSubmitting(false);
        setIsUploading(false);
    }
};

return (
    <div className="upload-form-container">
        {success ? (
            <div className="alert alert-success shadow-lg flex flex-col items-center">
                <span className="text-lg font-semibold">{successMessage}</span>
                <button className="btn btn-primary mt-4" onClick={() => navigate('/dashboard')}>Close</button>
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

                    {/* File input for images */}
                    <div className="form-group">
                        <div className="custom-file-input-wrapper">
                            <label htmlFor="images" className="custom-file-label">
                                {images.length > 0 ? `${images.length} file(s) selected` : 'Choose up to 5 images'}
                            </label>
                            <input
                                type="file"
                                id="images"
                                name="images"
                                multiple
                                accept="image/*"
                                onChange={handleFileChange}
                                className="custom-file-input"
                            />
                        </div>
                        {images.length > 0 && (
                            <ul className="file-name-list">
                                {images.map((file, idx) => <li key={idx}>{file.name}</li>)}
                            </ul>
                        )}
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
                        <button type="submit" className="btn btn-primary px-6" disabled={isSubmitting || isUploading}>
                            {isUploading ? 'Uploading Images...' : isSubmitting ? 'Submitting...' : submitButtonText}
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