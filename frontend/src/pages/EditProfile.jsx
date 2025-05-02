import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/components/SignUp.css'; // Reuse or create new styles
import { useAuthContext } from '../context/AuthContext';

function EditProfile() {
    const navigate = useNavigate();
    const { user, dispatch } = useAuthContext(); // Get user and dispatch from context
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        city: '',
        street: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Pre-fill form data when component mounts or user data changes
    useEffect(() => {
        if (user && user.user) {
            setFormData({
                firstName: user.user.firstName || '',
                lastName: user.user.lastName || '',
                email: user.user.email || '',
                city: user.user.city || '',
                street: user.user.street || '',
                // Note: Password is not pre-filled for security reasons.
                // Phone and Country are missing from the user object in context, might need adjustment
            });
        }
    }, [user]);

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

        if (!user || !user.token) {
            setError('You must be logged in to update your profile.');
            return;
        }

        // Filter out unchanged fields if needed, or send all fields
        const updatedData = { ...formData };
        // Add password field if you allow password changes here
        // delete updatedData.password; // Example if password change is separate

        try {
            const res = await fetch(`http://localhost:5000/api/users/${user.user._id}`, { // Assuming endpoint structure
                method: 'PATCH', // Or PUT
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`, // Send token for authorization
                },
                body: JSON.stringify(updatedData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Profile update failed');
            }

            // Update user context with new data
            dispatch({ type: 'UPDATE_USER', payload: data.user }); // Assuming backend returns updated user

            setSuccess(true);
            // Optionally navigate back or show success inline
            // setTimeout(() => navigate('/dashboard'), 2000); // Example navigation after delay

        } catch (err) {
            setError(err.message);
        }
    };

    if (!user) {
        return <div>Loading profile or please log in...</div>; // Handle loading state
    }

    return (
        <div className="form-wrapper">
            {!success ? (
                <>
                    <h2>Edit Profile</h2>
                    <form onSubmit={handleSubmit} className="form">
                        <input name="firstName" type="text" placeholder="First Name" value={formData.firstName} onChange={handleChange} required />
                        <input name="lastName" type="text" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required />
                        <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                        {/* Add Phone and Country if they exist in your user model and context */}
                        <input name="city" type="text" placeholder="City" value={formData.city} onChange={handleChange} />
                        <input name="street" type="text" placeholder="Street" value={formData.street} onChange={handleChange} />
                        {/* Consider adding password fields separately if needed */}

                        {error && <p className="error">{error}</p>}
                        <button className="toggle-view-btn" type="submit">Save Changes</button>
                    </form>
                     <button className="toggle-view-btn" onClick={() => navigate('/dashboard')}>Cancel</button>
                </>
            ) : (
                <div className="success-message">
                    <h2>Profile updated successfully! 🎉</h2>
                    <button className="toggle-view-btn" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
                </div>
            )}
        </div>
    );
}

export default EditProfile; 