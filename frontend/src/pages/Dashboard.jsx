// import React, { useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import '../styles/Dashboard.css';
// import { useAuthContext } from '../context/AuthContext';

// function Dashboard() {
//     const location = useLocation();
//     const user = location.state?.user;
//     const navigate = useNavigate();
//     const handleOffer = () => navigate('/upload');
//     const { dispatch } = useAuthContext();

//     const handleLogout = () => {
//         // Remove the token or user data
//         localStorage.removeItem('token');
//         //update the auth context
//         dispatch({ type: "LOGOUT" });
//         // Navigate to login
//         navigate('/account');
//     };

//     return (
//         <div className="dashboard-container">
//         <button className="offer-button" onClick={handleOffer}>Offer item to rent</button>
//         <button className="offer-button">Offer service</button>
//         <button className="offer-button">My items</button>
//         <button className="offer-button">My services</button>
//         <button className="offer-button">Edit profile</button>
//         <button className="logout-button" onClick={handleLogout}>Logout</button>
//         </div>
//     );
// }

// export default Dashboard;


import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';
import { useAuthContext } from '../context/AuthContext';

function Dashboard() {
    const { user, dispatch } = useAuthContext(); // Get user directly from context
    const navigate = useNavigate();

    const handleRentalOffer = () => navigate('/offer-rental');
    const handleServiceOffer = () => navigate('/offer-service');
    const handleRentalRequest = () => navigate('/request-rental');
    const handleServiceRequest = () => navigate('/request-service');

    const handleLogout = () => {
        // Remove the token or user data
        localStorage.removeItem('token');
        // Update the auth context
        dispatch({ type: "LOGOUT" });
        // Navigate to login
        navigate('/account');
    };

    if (!user) {
        // Handle the case if user is not logged in
        return <div>Please log in first.</div>;
    }

    return (
        <div className="dashboard-container">
            <h2>Welcome, {user.user.firstName} {user.user.lastName}</h2>
            <p>Email: {user.user.email}</p>
            <p>City: {user.user.city}</p>
            <p>Street: {user.user.street}</p>
            <button className="toggle-view-btn" onClick={handleRentalOffer}>Offer item to rent</button>
            <button className="toggle-view-btn" onClick={handleRentalRequest}>Request an item</button>
            <button className="toggle-view-btn" onClick={handleServiceOffer}>Offer service</button>
            <button className="toggle-view-btn" onClick={handleServiceRequest}>Request a service</button>
            <button className="toggle-view-btn">Edit profile</button>
            <button className="toggle-view-btn logout" onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default Dashboard;