import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../../styles/components/Modal.css';
import { rentalCategoryData, serviceCategoryData } from '../../constants/categories';
import { geocodeAddress } from '../HomePage/geocode';

const EditModal = ({ item, type, onSave, onCancel }) => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'he';
    const [form, setForm] = useState({
        ...item,
        subcategory: item.subcategory || '',
        city: item.city || '',
        street: item.street || '',
        location: item.location || '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        let updatedForm = { ...form };
        try {
            if (form.street && form.city) {
                const coords = await geocodeAddress(form.street, form.city);
                if (coords) {
                    updatedForm = { ...updatedForm, ...coords };
                }
            } else if (form.location) {
                const coords = await geocodeAddress(form.location);
                if (coords) {
                    updatedForm = { ...updatedForm, ...coords };
                }
            }
        } catch (err) {
            console.warn('Geocoding failed', err);
        }
        onSave(updatedForm);
    };

    const categoryData = type === 'rental' ? rentalCategoryData : serviceCategoryData;
    const categoryOptions = categoryData.map(cat => ({ value: cat.value, label: cat[i18n.language] }));
    const subcategoryOptions = form.category
        ? (categoryData.find(c => c.value === form.category)?.subcategories || []).map(sub => ({ value: sub.value, label: sub[i18n.language] }))
        : [];

    const handleCategoryChange = (e) => {
        setForm(prev => ({ ...prev, category: e.target.value, subcategory: '' }));
    };

    return (
        <div className="modal">
            <div className="modal-content" dir={isRTL ? 'rtl' : 'ltr'}>
                <h3>{t('common.edit')} {type === 'rental' ? t('common.rental') : t('common.service')}</h3>

                <label htmlFor="title">{t('common.title')}</label>
                <input name="title" value={form.title} onChange={handleChange} />

                <label htmlFor="description">{t('common.description')}</label>
                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={4}
                />

                <label htmlFor="category">{t('common.category')}</label>
                <select name="category" value={form.category} onChange={handleCategoryChange}>
                    <option value="">{t('common.select_category')}</option>
                    {categoryOptions.map((category) => (
                        <option key={category.value} value={category.value}>
                            {category.label}
                        </option>
                    ))}
                </select>
                {form.category && (
                    <>
                        <label htmlFor="subcategory">{t('forms.select_subcategory')}</label>
                        <select name="subcategory" value={form.subcategory} onChange={handleChange}>
                            <option value="">{t('forms.select_subcategory')}</option>
                            {subcategoryOptions.map((sub) => (
                                <option key={sub.value} value={sub.value}>
                                    {sub.label}
                                </option>
                            ))}
                        </select>
                    </>
                )}

                <label htmlFor="phone">{t('common.phone')}</label>
                <input name="phone" value={form.phone} onChange={handleChange} />

                <label htmlFor="location">{t('common.location')}</label>
                <input name="location" value={form.location} onChange={handleChange} />

                <label htmlFor="city">{t('common.city')}</label>
                <input name="city" value={form.city} onChange={handleChange} />

                <label htmlFor="street">{t('common.street')}</label>
                <input name="street" value={form.street} onChange={handleChange} />

                <label htmlFor="price">{t('common.price')} (₪)</label>
                <input
                    name="price"
                    type="number"
                    value={form.price}
                    onChange={handleChange}
                />

                <div className="modal-buttons">
                    <button onClick={handleSubmit}>{t('common.save')}</button>
                    <button className="danger" onClick={onCancel}>{t('common.cancel')}</button>
                </div>
            </div>
        </div>
    );
};

export default EditModal;