import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import '../../styles/components/LoginForm.css';
import { auth } from '../../firebase';

const baseUrl = 'https://giveit-backend.onrender.com'; // Replace with your backend URL

// After successful Firebase authentication
const syncUserToMongo = async (user) => {
    try {
        await fetch(`${baseUrl}/api/auth/sync`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                provider: 'firebase'
            })
        });
    } catch (error) {
        console.error('Failed to sync user to MongoDB:', error);
    }
};

const LoginForm = () => {
    const { t } = useTranslation();
    const { login, signInWithGoogle, loading, error: authError, clearError } = useAuthContext();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        if (authError) {
            setError(authError);
        }
    }, [authError]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        clearError();

        try {
            await login(email, password);
            const user = auth.currentUser;
            if (user) {
                await syncUserToMongo(user);
            }
            navigate('/dashboard');
        } catch (err) {
            console.error('Login error:', err);
        }
    };

    const handleGoogleSignIn = async () => {
        setError('');
        clearError();

        try {
            // Check if we're in a mobile environment
            const isMobile = window.Capacitor || 
                           /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                           window.innerWidth <= 768;

            if (isMobile) {
                // Show mobile-specific message
                setError('Redirecting to Google sign-in...');
            }

            await signInWithGoogle();
            
            // For mobile, the redirect will happen, so we don't navigate here
            if (!isMobile) {
                const user = auth.currentUser;
                if (user) {
                    await syncUserToMongo(user);
                }
                navigate('/dashboard');
            }
        } catch (err) {
            console.error('Google login error:', err);
            
            if (err.code === 'auth/unauthorized-domain') {
                setError(t('errors.unauthorized_domain') || t('auth.email') + ' ' + t('errors.general_error'));
            } else if (err.code === 'auth/operation-not-allowed') {
                setError(t('errors.operation_not_allowed') || t('auth.email') + ' ' + t('errors.general_error'));
            } else if (err.code === 'auth/popup-closed-by-user') {
                setError(t('errors.popup_closed') || 'Sign-in was cancelled. Please try again.');
            } else if (err.code === 'auth/popup-blocked') {
                setError(t('errors.popup_blocked') || 'Sign-in popup was blocked. Please allow popups for this site.');
            } else {
                setError(t('errors.google_signin_failed') || t('auth.email') + ' ' + t('errors.general_error'));
            }
            if (import.meta.env.MODE === 'development') {
                console.log('Error code:', err.code);
                console.log('Error message:', err.message);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="login-form">
            <h2>{t('navigation.sign_in')}</h2>
            <input
                type="email"
                placeholder={t('auth.email')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
            />

            <input
                type="password"
                placeholder={t('auth.password')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
            />

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            <button type="submit" disabled={loading}>
                {loading ? t('common.loading') : t('navigation.sign_in')}
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
            >
                {t('auth.sign_in_with_google') || t('navigation.sign_in') + ' Google'}
            </button>
            
            <p>
                {t('auth.no_account') || "Don't have an account?"}{' '}
                <button
                    type="button"
                    onClick={() => navigate('/signup')}
                    className="login-link"
                >
                    {t('navigation.sign_up')}
                </button>
            </p>
        </form>
    );  
};

export default LoginForm;