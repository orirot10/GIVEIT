import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

    // Debug authentication
    console.log('Current user:', user);
    console.log('Auth token:', user?.token);
    console.log('Auth header:', `Bearer ${user?.token}`);

    const formData = new FormData();

    // Append form fields
    Object.entries(form).forEach(([key, value]) => {
        if (value) formData.append(key, value);
    });

    // Append images
    images.forEach((file, index) => {
        formData.append('images', file);
    });

    try {
        console.log('Submitting to:', submitUrl);
        console.log('Form data:', Object.fromEntries(formData));

        const res = await fetch(submitUrl, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
            body: formData,
        });

        console.log('Response status:', res.status);
        console.log('Response headers:', Object.fromEntries(res.headers.entries()));

        // First try to parse as JSON
        let data;
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            data = await res.json();
            console.log('Response data:', data);
        } else {
            // If not JSON, get the text
            const text = await res.text();
            console.error('Server returned non-JSON response:', text);
            throw new Error('Server returned an invalid response');
        }

        if (!res.ok) {
            throw new Error(data.error || `HTTP error! status: ${res.status}`);
        }

        console.log('Response:', data);
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
        <button className="btn btn-primary mt-4" onClick={() => navigate('/dashboard')}>Close</button>
        </div>
    ) : (
        <>
        <h2 className="text-xl font-bold mb-4">{titleText}</h2>
        {error && (
            <div className="alert alert-error mb-4">
                <span>{error}</span>
            </div>
        )}
        <form onSubmit={handleSubmit} className="upload-form space-y-4" encType="multipart/form-data">
            <input name="title" placeholder="Title" value={form.title} onChange={handleChange} className="input input-bordered w-full" required />
            <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="textarea textarea-bordered w-full" required />
            <select name="category" value={form.category} onChange={handleChange} className="select select-bordered w-full" required>
            <option value="">Select category</option>
            {categories.map((cat, index) => <option key={index} value={cat}>{cat}</option>)}
            </select>
            <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} className="input input-bordered w-full" required />
            <select name="pricePeriod" value={form.pricePeriod} onChange={handleChange} className="select select-bordered w-full">
                <option value="use">Per Use</option>
                <option value="hour">Per Hour</option>
                <option value="day">Per Day</option>
                <option value="week">Per Week</option>
                <option value="month">Per Month</option>
            </select>

            {/* File input for images */}
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

            <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} className="input input-bordered w-full" required />
            <input name="city" placeholder="City" value={form.city} onChange={handleChange} className="input input-bordered w-full" required />
            <input name="street" placeholder="Street" value={form.street} onChange={handleChange} className="input input-bordered w-full" required />

            <div className="button-group flex gap-2">
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : submitButtonText}
            </button>
            <button type="button" className="btn btn-outline" onClick={() => navigate('/dashboard')}>Cancel</button>
            </div>
        </form>
        </>
    )}
    </div>
);
};

export default ModalUploadForm;