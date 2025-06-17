import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../../styles/components/Modal.css';
import { rentalCategories, serviceCategories } from '../../constants/categories';

const EditModal = ({ item, type, onSave, onCancel }) => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'he';
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
                <select name="category" value={form.category} onChange={handleChange}>
                    <option value="">{t('common.select_category')}</option>
                    {categoryOptions.map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>

                <label htmlFor="phone">{t('common.phone')}</label>
                <input name="phone" value={form.phone} onChange={handleChange} />

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