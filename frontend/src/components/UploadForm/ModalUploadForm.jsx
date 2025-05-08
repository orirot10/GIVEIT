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

const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
};

const handleFileChange = e => {
    setImages([...e.target.files]); // up to 5 files
};

const handleSubmit = async e => {
    e.preventDefault();

    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
    formData.append(key, value);
    });

    images.forEach((file, index) => {
    formData.append('images', file); // assuming backend expects: images[]
    });

    try {
    const res = await fetch(submitUrl, {
        method: 'POST',
        headers: {
        Authorization: `Bearer ${user.token}`,
        },
        body: formData,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error);

    setSuccess(true);
    } catch (err) {
    console.error(err);
    alert(err.message);
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
        <form onSubmit={handleSubmit} className="upload-form space-y-4" encType="multipart/form-data">
            <input name="title" placeholder="Title" value={form.title} onChange={handleChange} className="input input-bordered w-full" />
            <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="textarea textarea-bordered w-full" />
            <select name="category" value={form.category} onChange={handleChange} className="select select-bordered w-full">
            <option value="">Select category</option>
            {categories.map((cat, index) => <option key={index} value={cat}>{cat}</option>)}
            </select>
            <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} className="input input-bordered w-full" />
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

            <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} className="input input-bordered w-full" />
            <input name="city" placeholder="City" value={form.city} onChange={handleChange} className="input input-bordered w-full" />
            <input name="street" placeholder="Street" value={form.street} onChange={handleChange} className="input input-bordered w-full" />

            <div className="button-group flex gap-2">
            <button type="submit" className="btn btn-primary">{submitButtonText}</button>
            <button type="button" className="btn btn-outline" onClick={() => navigate('/dashboard')}>Cancel</button>
            </div>
        </form>
        </>
    )}
    </div>
);
};

export default ModalUploadForm;