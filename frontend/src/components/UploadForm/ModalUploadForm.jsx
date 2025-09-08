import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ImageUpload from '../ImageUpload';
import '../../styles/components/UploadForm.css';
import { geocodeAddress } from '../HomePage/geocode';
import { usePricePeriodTranslation } from '../../utils/pricePeriodTranslator';

const ModalUploadForm = ({
titleText,
categories,
submitUrl,
successMessage,
submitButtonText,
user,
}) => {
const navigate = useNavigate();
const { t, i18n } = useTranslation();
const { getPricePeriodOptions } = usePricePeriodTranslation();
const isRTL = i18n.language === 'he';

const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    pricePeriod: 'use',
    firstName: user?.firstName || user?.displayName?.split(' ')[0] || '',
    lastName: user?.lastName || (user?.displayName?.split(' ').length > 1 ? user?.displayName?.split(' ')[1] : '') || '',
    phone: user?.phone || '',
    city: user?.city || '',
    street: user?.street || ''
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

        if (!form.firstName.trim() || !form.lastName.trim()) {
            throw new Error('First and last name are required');
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
            firstName: form.firstName || 'Anonymous',
            lastName: form.lastName || '',
            images: imageUrls,
            lat: coords ? coords.lat : undefined,
            lng: coords ? coords.lng : undefined
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
    <div className="upload-form-container" style={{ fontFamily: 'Heebo, Arial, sans-serif' }} dir={isRTL ? 'rtl' : 'ltr'}>
        {success ? (
            <div className="alert alert-success shadow-lg flex flex-col items-center">
                <span className="text-lg font-semibold">{successMessage}</span>
                <button className="btn btn-primary mt-4" onClick={() => navigate('/')}>{t('forms.close')}</button>
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
                        <input name="title" placeholder={t('forms.title_placeholder')} value={form.title} onChange={handleChange} className="input input-bordered w-full" required />
                    </div>
                    <div className="form-group">
                        <textarea name="description" placeholder={t('forms.description_placeholder')} value={form.description} onChange={handleChange} className="textarea textarea-bordered w-full" required />
                    </div>
                    <div className="form-group">
                        <select name="category" value={form.category} onChange={handleChange} className="select select-bordered w-full" required>
                            <option value="">{t('forms.select_category')}</option>
                            {categories.map((cat) => (
                                <option key={cat.value} value={cat.value}>{cat.label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <input name="price" type="number" placeholder={t('forms.price_placeholder')} value={form.price} onChange={handleChange} className="input input-bordered w-full" required />
                    </div>
                    <div className="form-group">
                        <select name="pricePeriod" value={form.pricePeriod} onChange={handleChange} className="select select-bordered w-full">
                            {getPricePeriodOptions().map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Image upload */}
                    <div className="form-group">
                        <label className="block text-sm font-medium mb-2">{t('forms.images_label')}</label>
                        <ImageUpload 
                            onImageUpload={handleImageUpload}
                            multiple={true}
                            accept="image/*"
                        />
                        {imageUrls.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                                {imageUrls.map((url, index) => (
                                    <img key={index} src={url} alt={`preview ${index}`} className="w-16 h-16 object-cover rounded" />
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <input name="firstName" placeholder={t('forms.first_name_placeholder')} value={form.firstName} onChange={handleChange} className="input input-bordered w-full" required />
                    </div>
                    <div className="form-group">
                        <input name="lastName" placeholder={t('forms.last_name_placeholder')} value={form.lastName} onChange={handleChange} className="input input-bordered w-full" required />
                    </div>
                    <div className="form-group">
                        <input name="phone" placeholder={t('forms.phone_placeholder')} value={form.phone} onChange={handleChange} className="input input-bordered w-full" required />
                    </div>
                    <div className="form-group">
                        <input name="city" placeholder={t('forms.city_placeholder')} value={form.city} onChange={handleChange} className="input input-bordered w-full" required />
                    </div>
                    <div className="form-group">
                        <input name="street" placeholder={t('forms.street_placeholder')} value={form.street} onChange={handleChange} className="input input-bordered w-full" required />
                    </div>

                    <div className="button-group flex justify-center gap-4 mt-6">
                        <button type="submit" className="btn btn-primary px-6" disabled={isSubmitting}>
                            {isSubmitting ? t('forms.submitting') : submitButtonText}
                        </button>
                        <button type="button" className="btn btn-outline px-6" onClick={() => navigate('/')}>{t('forms.cancel')}</button>
                    </div>
                </form>
            </>
        )}
    </div>
);
};

export default ModalUploadForm;