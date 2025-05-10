import { useEffect } from 'react';
import { useAuthContext } from '../context/AuthContext';
import LoginForm from '../components/Auth/LoginForm.jsx';
import './account.css';
import { useNavigate } from 'react-router-dom';


const Account = () => {
    const { user } = useAuthContext();
    
    return (
        <div className="account-container">
            <div className="login-form-container">
            {!user && <LoginForm />}
            </div>
        </div>
    );
};

export default Account;