import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateProfile } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import '../styles/components/SignUp.css';
import { useAuthContext } from '../context/AuthContext';

function EditProfile() {
    const navigate = useNavigate();
    const { user } = useAuthContext();
    const [formData, setFormData] = useState({
        displayName: '',
        photoURL: '',
        phoneNumber: '',
        city: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const loadUserProfile = async () => {
            if (user) {
                try {
                    const userDoc = await getDoc(doc(db, 'users', user.uid));
                    const userData = userDoc.data() || {};
                    
                    setFormData({
                        displayName: user.displayName || '',
                        photoURL: user.photoURL || '',
                        phoneNumber: userData.phoneNumber || '',
                        city: userData.city || ''
                    });
                } catch (err) {
                    setError('Failed to load profile data');
                }
            }
        };

        loadUserProfile();
    }, [user]);

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Update Firebase Auth profile
            await updateProfile(auth.currentUser, {
                displayName: formData.displayName,
                photoURL: formData.photoURL
            });

            // Update Firestore document
            await updateDoc(doc(db, 'users', user.uid), {
                displayName: formData.displayName,
                photoURL: formData.photoURL,
                phoneNumber: formData.phoneNumber,
                city: formData.city,
                updatedAt: new Date()
            });

            setSuccess(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return <div>Please log in to edit your profile.</div>;
    }

    return (
        <div className="form-wrapper">
            {!success ? (
                <>
                    <h2>Edit Profile</h2>
                    <form onSubmit={handleSubmit} className="form">
                        <input 
                            name="displayName" 
                            type="text" 
                            placeholder="Display Name" 
                            value={formData.displayName} 
                            onChange={handleChange} 
                            required 
                        />
                        <input 
                            name="photoURL" 
                            type="url" 
                            placeholder="Profile Picture URL" 
                            value={formData.photoURL} 
                            onChange={handleChange} 
                        />
                        <input 
                            name="phoneNumber" 
                            type="tel" 
                            placeholder="Phone Number" 
                            value={formData.phoneNumber} 
                            onChange={handleChange} 
                        />
                        <input 
                            name="city" 
                            type="text" 
                            placeholder="City" 
                            value={formData.city} 
                            onChange={handleChange} 
                        />

                        {error && <p className="error">{error}</p>}
                        <button className="toggle-view-btn" type="submit" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </form>
                    <button className="toggle-view-btn" onClick={() => navigate('/dashboard')}>
                        Cancel
                    </button>
                </>
            ) : (
                <div className="success-message">
                    <h2>Profile updated successfully! 🎉</h2>
                    <button className="toggle-view-btn" onClick={() => navigate('/dashboard')}>
                        Back to Dashboard
                    </button>
                </div>
            )}
        </div>
    );
}

export default EditProfile; 