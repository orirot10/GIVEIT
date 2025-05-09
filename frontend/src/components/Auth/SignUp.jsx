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

    try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/signUp`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || 'Signup failed');
    }

    setSuccess(true);
    } catch (err) {
    setError(err.message);
    }
};

return (
    <div className="form-wrapper">
    {!success ? (
        <>
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit} className="form">
            <input name="firstName" type="text" placeholder="First Name" value={formData.firstName} onChange={handleChange} required />
            <input name="lastName" type="text" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required />
            <input name="phone" type="tel" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />
            <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
            <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
            <input name="country" type="text" placeholder="Country" value={formData.country} onChange={handleChange} required />
            <input name="city" type="text" placeholder="City" value={formData.city} onChange={handleChange} />
            <input name="street" type="text" placeholder="Street" value={formData.street} onChange={handleChange} />

            {error && <p className="error">{error}</p>}
            <button className="primary-button" type="submit">Sign Up</button>
        </form>
        </>
    ) : (
        <div className="success-message">
        <h2>You successfully signed up 🎉</h2>
        <button className="primary-button" onClick={() => navigate('/account')}>Go to Login</button>
        </div>
    )}
    </div>
);
}

export default SignUp;