import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';

const MobileAuthHandler = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, loading } = useAuthContext();
  const [authStatus, setAuthStatus] = useState('processing');

  useEffect(() => {
    // Check if we're returning from a Google auth redirect
    const urlParams = new URLSearchParams(window.location.search);
    const isAuthRedirect = urlParams.has('apiKey') || 
                          window.location.pathname.includes('/__/auth/handler');

    if (isAuthRedirect) {
      setAuthStatus('processing');
      // The AuthContext will handle the redirect result
      // We just need to wait for it to complete
    } else {
      // Not an auth redirect, redirect to home
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    // If user is authenticated, redirect to dashboard
    if (user && !loading) {
      setAuthStatus('success');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    }
  }, [user, loading, navigate]);

  if (authStatus === 'processing') {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        padding: '20px',
        fontFamily: "'David Libre', Arial, sans-serif",
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          border: '4px solid rgba(255,255,255,0.3)',
          borderTop: '4px solid white',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '20px'
        }} />
        <h2 style={{ margin: '0 0 10px 0', fontSize: '24px' }}>
          {t('auth.processing_signin') || 'Processing Sign-In...'}
        </h2>
        <p style={{ 
          margin: '0', 
          fontSize: '16px', 
          opacity: 0.8,
          textAlign: 'center',
          maxWidth: '300px'
        }}>
          {t('auth.please_wait') || 'Please wait while we complete your sign-in process.'}
        </p>
        
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (authStatus === 'success') {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        padding: '20px',
        fontFamily: "'David Libre', Arial, sans-serif",
        background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
        color: 'white'
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px'
        }}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <polyline points="20,6 9,17 4,12"></polyline>
          </svg>
        </div>
        <h2 style={{ margin: '0 0 10px 0', fontSize: '24px' }}>
          {t('auth.signin_successful') || 'Sign-In Successful!'}
        </h2>
        <p style={{ 
          margin: '0', 
          fontSize: '16px', 
          opacity: 0.8,
          textAlign: 'center'
        }}>
          {t('auth.redirecting') || 'Redirecting to dashboard...'}
        </p>
      </div>
    );
  }

  return null;
};

export default MobileAuthHandler; 