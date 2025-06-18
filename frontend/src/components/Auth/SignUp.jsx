import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import '../../styles/components/SignUp.css';
import '../../styles/components/GoogleAuth.css';

function SignUp() {
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

    // Use auth context error if available
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

        try {
            await signUp(formData);
            navigate('/dashboard');
        } catch (err) {
            console.error('Signup error:', err);
            // Error is handled by the AuthContext
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
            // Error is handled by the AuthContext
        }
    };

    return (
        <div className="form-wrapper">
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit} className="form">
                <div className="form-group">
                    <input 
                        name="firstName" 
                        type="text" 
                        placeholder="First Name" 
                        value={formData.firstName} 
                        onChange={handleChange} 
                        required 
                        disabled={loading} 
                    />
                    <input 
                        name="lastName" 
                        type="text" 
                        placeholder="Last Name" 
                        value={formData.lastName} 
                        onChange={handleChange} 
                        required 
                        disabled={loading} 
                    />
                </div>
                <input 
                    name="email" 
                    type="email" 
                    placeholder="Email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    required 
                    disabled={loading} 
                />
                <input 
                    name="phone" 
                    type="tel" 
                    placeholder="Phone Number" 
                    value={formData.phone} 
                    onChange={handleChange} 
                    required 
                    disabled={loading} 
                />
                <input 
                    name="password" 
                    type="password" 
                    placeholder="Password" 
                    value={formData.password} 
                    onChange={handleChange} 
                    required 
                    disabled={loading} 
                />
                
                <div className="optional-fields">
                    <h3>Optional Information</h3>
                    <input 
                        name="country" 
                        type="text" 
                        placeholder="Country" 
                        value={formData.country} 
                        onChange={handleChange} 
                        disabled={loading} 
                    />
                    <input 
                        name="city" 
                        type="text" 
                        placeholder="City" 
                        value={formData.city} 
                        onChange={handleChange} 
                        disabled={loading} 
                    />
                    <input 
                        name="street" 
                        type="text" 
                        placeholder="Street" 
                        value={formData.street} 
                        onChange={handleChange} 
                        disabled={loading} 
                    />
                </div>

                {error && (
                    <div className="error-message" style={{ color: 'red', margin: '10px 0', padding: '8px', borderRadius: '4px', backgroundColor: 'rgba(255,0,0,0.05)' }}>
                        {error}
                    </div>
                )}

                <button className="primary-button" type="submit" disabled={loading}>
                    {loading ? 'Processing...' : 'Sign Up'}
                </button>
                
                <div className="or-divider">
                    <hr />
                    <span>OR</span>
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
                    Sign up with Google
                </button>
                
                <div className="auth-links">
                    <p>Already have an account?</p>
                    <button 
                        type="button" 
                        className="login-link" 
                        onClick={() => navigate('/login')}
                    >
                        Return to Login
                    </button>
                </div>
            </form>
        </div>
    );
}

export default SignUp;