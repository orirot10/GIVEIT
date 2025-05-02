import { useState } from 'react';
import '../../styles/components/Modal.css';
import { rentalCategories, serviceCategories } from '../../constants/categories';

const EditModal = ({ item, type, onSave, onCancel }) => {
    const [form, setForm] = useState({ ...item });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        onSave(form);
    };

    const categoryOptions = type === 'rental' ? rentalCategories : serviceCategories;

    return (
        <div className="modal">
            <div className="modal-content">
                <h3>Edit {type === 'rental' ? 'Rental' : 'Service'}</h3>

                <label htmlFor="title">Title</label>
                <input name="title" value={form.title} onChange={handleChange} />

                <label htmlFor="description">Description</label>
                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={4}
                />

                <label htmlFor="category">Category</label>
                <select name="category" value={form.category} onChange={handleChange}>
                    <option value="">Select a category</option>
                    {categoryOptions.map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>

                <label htmlFor="phone">Phone</label>
                <input name="phone" value={form.phone} onChange={handleChange} />

                <label htmlFor="price">Price (₪)</label>
                <input
                    name="price"
                    type="number"
                    value={form.price}
                    onChange={handleChange}
                />

                <div className="modal-buttons">
                    <button onClick={handleSubmit}>Save</button>
                    <button className="danger" onClick={onCancel}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default EditModal;