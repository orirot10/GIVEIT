import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import '../../styles/components/SignUp.css';

function SignUp() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { signUp, signInWithGoogle, loading, error: authError, clearError } = useAuthContext();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        password: '',
        country: '',
        city: '',
        street: '',
    });

    const [error, setError] = useState('');

    useEffect(() => {
        if (authError) {
            setError(authError);
        }
    }, [authError]);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        clearError();
        if (formData.password.length < 6) {
            setError(t('errors.password_too_short') || t('auth.password') + ' ' + t('errors.general_error'));
            return;
        }
        try {
            await signUp(formData);
            navigate('/dashboard');
        } catch (err) {
            console.error('Signup error:', err);
        }
    };

    const handleGoogleSignIn = async () => {
        setError('');
        clearError();
        try {
            await signInWithGoogle();
            navigate('/dashboard');
        } catch (err) {
            console.error('Google login error:', err);
            if (err.code === 'auth/unauthorized-domain') {
                setError(t('errors.unauthorized_domain') || t('auth.email') + ' ' + t('errors.general_error'));
                if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.MODE === 'development') {
                    window.open('/auth-domain-error.html', '_blank');
                }
            }
        }
    };

    return (
        <>
            <h2>{t('navigation.sign_up')}</h2>
            <form onSubmit={handleSubmit} className="sign-up-form">
                <div className="form-group">
                    <input 
                        name="firstName" 
                        type="text" 
                        placeholder={t('forms.first_name_placeholder')} 
                        value={formData.firstName} 
                        onChange={handleChange} 
                        required 
                        disabled={loading} 
                    />
                    <input 
                        name="lastName" 
                        type="text" 
                        placeholder={t('forms.last_name_placeholder')} 
                        value={formData.lastName} 
                        onChange={handleChange} 
                        required 
                        disabled={loading} 
                    />
                </div>
                <input 
                    name="email" 
                    type="email" 
                    placeholder={t('auth.email')} 
                    value={formData.email} 
                    onChange={handleChange} 
                    required 
                    disabled={loading} 
                />
                <input 
                    name="phone" 
                    type="tel" 
                    placeholder={t('auth.phone')} 
                    value={formData.phone} 
                    onChange={handleChange} 
                    required 
                    disabled={loading} 
                />
                <input 
                    name="password" 
                    type="password" 
                    placeholder={t('auth.password')} 
                    value={formData.password} 
                    onChange={handleChange} 
                    required 
                    disabled={loading} 
                />
                <div className="optional-fields">
                    <h3>{t('common.optional_information') || t('forms.optional_information') || 'Optional Information'}</h3>
                    <input 
                        name="country" 
                        type="text" 
                        placeholder={t('forms.country_placeholder') || t('common.country')} 
                        value={formData.country} 
                        onChange={handleChange} 
                        disabled={loading} 
                    />
                    <input 
                        name="city" 
                        type="text" 
                        placeholder={t('forms.city_placeholder') || t('common.city')} 
                        value={formData.city} 
                        onChange={handleChange} 
                        disabled={loading} 
                    />
                    <input 
                        name="street" 
                        type="text" 
                        placeholder={t('forms.street_placeholder') || t('common.street')} 
                        value={formData.street} 
                        onChange={handleChange} 
                        disabled={loading} 
                    />
                </div>
                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}
                <button className="primary-button" type="submit" disabled={loading}>
                    {loading ? t('common.loading') : t('navigation.sign_up')}
                </button>
                <div className="or-divider">
                    <hr />
                    <span>{t('common.or') || 'OR'}</span>
                </div>
                <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="google-btn"
                    style={{ marginBottom: '15px' }}
                >
                    {t('auth.register_with_google') || t('navigation.sign_up') + ' Google'}
                </button>
                <div className="auth-links">
                    <p>{t('auth.already_have_account') || 'Already have an account?'}</p>
                    <button 
                        type="button" 
                        className="login-link" 
                        onClick={() => navigate('/login')}
                    >
                        {t('navigation.sign_in')}
                    </button>
                </div>
            </form>
        </>
    );
}

export default SignUp;