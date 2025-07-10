import { createContext, useContext, useReducer, useEffect } from 'react';
import { auth } from '../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  signInWithRedirect,
  getRedirectResult
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      localStorage.setItem('user', JSON.stringify(action.payload));
      return { user: action.payload, loading: false };
    case 'LOGOUT':
      localStorage.removeItem('user');
      return { user: null, loading: false };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: JSON.parse(localStorage.getItem('user')) || null,
    loading: true,
    error: null,
  });

  const syncUserToMongo = async (user) => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'https://giveit-backend.onrender.com';
      await fetch(`${baseUrl}/api/auth/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          provider: 'firebase'
        })
      });
    } catch (error) {
      console.error('Failed to sync user to MongoDB:', error);
    }
  };

  useEffect(() => {
    // 🔁 Step 2: Handle redirect result after Google login
    getRedirectResult(auth)
      .then(async (result) => {
        if (result && result.user) {
          const user = result.user;
          const userDoc = await getDoc(doc(db, 'users', user.uid));

          if (!userDoc.exists()) {
            const names = user.displayName?.split(' ') || ['', ''];
            const firstName = names[0] || '';
            const lastName = names.slice(1).join(' ') || '';

            await setDoc(doc(db, 'users', user.uid), {
              firstName,
              lastName,
              email: user.email,
              phone: user.phoneNumber || '',
              photoURL: user.photoURL || '',
              createdAt: new Date().toISOString(),
              authProvider: 'google'
            });
          }

          await syncUserToMongo(user);
          const token = await user.getIdToken(true);
          dispatch({
            type: 'LOGIN',
            payload: {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
              token,
            }
          });
        }
      })
      .catch((error) => {
        console.error('Redirect login error:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Google sign-in failed.' });
      });

    // 🔄 Firebase auth state listener
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken(true);
          await syncUserToMongo(firebaseUser);
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          const userData = userDoc.exists() ? userDoc.data() : {};

          dispatch({
            type: 'LOGIN',
            payload: {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
              token,
              ...userData,
            }
          });
        } catch (error) {
          console.error('Error loading user:', error);
          dispatch({ type: 'LOGOUT' });
        }
      } else {
        dispatch({ type: 'LOGOUT' });
      }

      dispatch({ type: 'SET_LOADING', payload: false });
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await syncUserToMongo(userCredential.user);
      return userCredential.user;
    } catch (error) {
      let message = 'Login failed. Please check your credentials.';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        message = 'Invalid email or password';
      }
      dispatch({ type: 'SET_ERROR', payload: message });
      throw error;
    }
  };

  const signUp = async (userData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: `${userData.firstName} ${userData.lastName}`
      });

      await setDoc(doc(db, 'users', user.uid), {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone,
        city: userData.city || '',
        createdAt: new Date().toISOString(),
        authProvider: 'email'
      });

      await syncUserToMongo(user);
      return user;
    } catch (error) {
      console.error('Signup error:', error.message);
      dispatch({ type: 'SET_ERROR', payload: 'Signup failed. Please try again.' });
      throw error;
    }
  };

  // ✅ Step 1: Google Sign-In using redirect (safe for mobile)
  const signInWithGoogle = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });
    try {
      const { googleProvider } = await import('../firebase');
      googleProvider.addScope('profile');
      googleProvider.addScope('email');
      await signInWithRedirect(auth, googleProvider);
    } catch (error) {
      console.error('Google Sign-In error:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Google sign-in failed.' });
      throw error;
    }
  };

  const logout = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await signOut(auth);
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Logout failed. Please try again.' });
    }
  };

  const clearError = () => dispatch({ type: 'CLEAR_ERROR' });

  return (
    <AuthContext.Provider value={{
      ...state,
      login,
      signUp,
      logout,
      signInWithGoogle,
      clearError
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuthContext must be used within an AuthProvider');
  return context;
};
