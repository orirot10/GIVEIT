import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/components/SignUp.css';

function SignUp() {
const navigate = useNavigate();
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
const [success, setSuccess] = useState(false);
const [isLoading, setIsLoading] = useState(false);

const handleChange = (e) => {
    setFormData((prev) => ({
    ...prev,
    [e.target.name]: e.target.value,
    }));
};

const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setIsLoading(true);

    try {
    // First, sign up the user
    const signUpRes = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/signUp`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    });

    const signUpData = await signUpRes.json();

    if (!signUpRes.ok) {
        throw new Error(signUpData.message || 'Signup failed');
    }

    // After successful signup, automatically log in
    const loginRes = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: formData.email,
            password: formData.password,
        }),
    });

    const loginData = await loginRes.json();

    if (!loginRes.ok) {
        throw new Error(loginData.message || 'Login failed');
    }

    // Store the token in localStorage
    localStorage.setItem('token', loginData.token);
    
    // Navigate to homepage
    navigate('/');
    } catch (err) {
    setError(err.message);
    } finally {
    setIsLoading(false);
    }
};

return (
    <div className="form-wrapper">
    {!success ? (
        <>
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit} className="form">
            <input name="firstName" type="text" placeholder="First Name" value={formData.firstName} onChange={handleChange} required disabled={isLoading} />
            <input name="lastName" type="text" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required disabled={isLoading} />
            <input name="phone" type="tel" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required disabled={isLoading} />
            <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required disabled={isLoading} />
            <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required disabled={isLoading} />
            <input name="country" type="text" placeholder="Country" value={formData.country} onChange={handleChange} required disabled={isLoading} />
            <input name="city" type="text" placeholder="City" value={formData.city} onChange={handleChange} disabled={isLoading} />
            <input name="street" type="text" placeholder="Street" value={formData.street} onChange={handleChange} disabled={isLoading} />

            {error && <p className="error">{error}</p>}
            <button className="primary-button" type="submit" disabled={isLoading}>
                {isLoading ? 'Processing...' : 'Sign Up'}
            </button>
        </form>
        </>
    ) : (
        <div className="success-message">
        <h2>You successfully signed up 🎉</h2>
        <button className="primary-button" onClick={() => navigate('/')}>Go to Homepage</button>
        </div>
    )}
    </div>
);
}

export default SignUp;