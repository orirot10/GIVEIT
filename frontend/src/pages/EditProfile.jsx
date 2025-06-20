import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import '../styles/components/SignUp.css';
import { useAuthContext } from '../context/AuthContext';
import ImageUpload from '../components/ImageUpload';

function EditProfile() {
    const navigate = useNavigate();
    const { user } = useAuthContext();
    const [formData, setFormData] = useState({
        displayName: '',
        photoURL: '',
        phoneNumber: '',
        city: '',
        firstName: '',
        lastName: '',
        street: '',
        country: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const loadUserProfile = async () => {
            if (user?.uid) {
                try {
                    // Get user data from Firestore instead of API
                    const userDocRef = doc(db, 'users', user.uid);
                    const userDoc = await getDoc(userDocRef);
                    
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        const names = user.displayName ? user.displayName.split(' ') : ['', ''];
                        
                        setFormData({
                            displayName: user.displayName || '',
                            photoURL: user.photoURL || userData.photoURL || '',
                            phoneNumber: userData.phoneNumber || userData.phone || '',
                            city: userData.city || '',
                            firstName: userData.firstName || names[0] || '',
                            lastName: userData.lastName || (names.length > 1 ? names.slice(1).join(' ') : ''),
                            street: userData.street || '',
                            country: userData.country || ''
                        });
                    } else {
                        // If no Firestore document exists, use Firebase Auth data
                        const names = user.displayName ? user.displayName.split(' ') : ['', ''];
                        setFormData({
                            displayName: user.displayName || '',
                            photoURL: user.photoURL || '',
                            phoneNumber: '',
                            city: '',
                            firstName: names[0] || '',
                            lastName: names.length > 1 ? names.slice(1).join(' ') : '',
                            street: '',
                            country: ''
                        });
                    }
                } catch (err) {
                    setError('Failed to load profile data');
                    console.error(err);
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
                displayName: `${formData.firstName} ${formData.lastName}`,
                photoURL: formData.photoURL
            });

            // Update Firestore document with all user data
            await updateDoc(doc(db, 'users', user.uid), {
                firstName: formData.firstName,
                lastName: formData.lastName,
                displayName: `${formData.firstName} ${formData.lastName}`,
                photoURL: formData.photoURL,
                phoneNumber: formData.phoneNumber,
                phone: formData.phoneNumber,
                city: formData.city,
                street: formData.street,
                country: formData.country,
                updatedAt: new Date()
            });
            
            setSuccess(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = (imageUrl) => {
        setFormData(prev => ({
            ...prev,
            photoURL: imageUrl
        }));
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
                            name="firstName" 
                            type="text" 
                            placeholder="First Name" 
                            value={formData.firstName} 
                            onChange={handleChange} 
                            required 
                        />
                        <input 
                            name="lastName" 
                            type="text" 
                            placeholder="Last Name" 
                            value={formData.lastName} 
                            onChange={handleChange} 
                            required 
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
                        <input 
                            name="street" 
                            type="text" 
                            placeholder="Street Address" 
                            value={formData.street} 
                            onChange={handleChange} 
                        />
                        <input 
                            name="country" 
                            type="text" 
                            placeholder="Country" 
                            value={formData.country} 
                            onChange={handleChange} 
                        />
                        
                        <div className="image-upload-section">
                            <label>Profile Picture:</label>
                            <ImageUpload onImageUpload={handleImageUpload} />
                            {formData.photoURL && (
                                <img 
                                    src={formData.photoURL} 
                                    alt="Profile" 
                                    style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '50%' }}
                                />
                            )}
                        </div>

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