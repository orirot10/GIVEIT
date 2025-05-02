import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';

const LoginForm = () => {
    const { dispatch } = useAuthContext();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [userData, setUserData] = useState({});

    const navigate = useNavigate();

    // Check if user data exists in localStorage
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUserData(storedUser.user); // Set the user data from localStorage if available
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
        const res = await fetch('http://localhost:5000/api/auth/logIn', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
            setError(data.message || 'Something went wrong');
            return;
        }

        // You can store token or set user context here if needed
        // localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data)); // this includes the JWT token
        dispatch({ type: 'LOGIN', payload: data });

        // alert(data.message);
        navigate('/dashboard', { state: { user: data.user } });
        } catch (err) {
        console.error(err);
        setError('Something went wrong');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>
        <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
        />

        <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
        />

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button type="submit">Log In</button>
        <p>
            Don't have an account?{' '}
            <span
            onClick={() => navigate('/signup')}
            style={{ color: 'blue', cursor: 'pointer' }}
            >
            Sign Up
            </span>
        </p>
        </form>
    );  
};

export default LoginForm;