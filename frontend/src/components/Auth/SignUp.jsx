import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import '../../styles/components/SignUp.css';
import '../../styles/components/GoogleAuth.css';

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
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 48 48">
                        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                    </svg>
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