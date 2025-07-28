import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import '../../styles/components/GoogleAuth.css';
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
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 48 48">
                    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                </svg>
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