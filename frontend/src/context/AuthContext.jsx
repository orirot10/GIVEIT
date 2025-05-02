import { createContext, useContext, useReducer, useEffect } from 'react';

const AuthContext = createContext();

const authReducer = (state, action) => {
switch (action.type) {
    case 'LOGIN':
        localStorage.setItem('user', JSON.stringify(action.payload)); // <-- Save user
        return { user: action.payload };
    case 'LOGOUT':
        localStorage.removeItem('user'); // <-- Remove user
        return { user: null };
    default:
        return state;
}
};

export const AuthProvider = ({ children }) => {
const [state, dispatch] = useReducer(authReducer, { user: null });

// Check for user in localStorage on app start
useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
    dispatch({ type: 'LOGIN', payload: storedUser });
    }
}, []);

return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
    {children}
    </AuthContext.Provider>
);
};

export const useAuthContext = () => {
    return useContext(AuthContext);
};