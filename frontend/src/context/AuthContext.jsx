import { createContext, useContext, useReducer, useEffect } from 'react';
import { auth } from '../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  signInWithPopup,
  signInWithCredential,
  GoogleAuthProvider
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { Capacitor } from '@capacitor/core';

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
    error: null
  });

  // Initialize Google Auth for native platforms
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      GoogleAuth.initialize({
        clientId: '552189348251-93esjcu95at9ji45ugnddd60nistmqb6.apps.googleusercontent.com',
        scopes: ['profile', 'email'],
        grantOfflineAccess: true,
      });
    }
  }, []);

  // Sync user to MongoDB
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
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Get the user's token (force refresh)
          const token = await firebaseUser.getIdToken(true);
          
          // Sync user to MongoDB
          await syncUserToMongo(firebaseUser);
          
          // Get additional user data from Firestore
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
              ...userData
            }
          });
        } catch (error) {
          console.error('Error getting user data:', error);
          dispatch({ type: 'LOGOUT' });
        }
      } else {
        dispatch({ type: 'LOGOUT' });
      }
      
      dispatch({ type: 'SET_LOADING', payload: false });
    });

    return () => unsubscribe();
  }, []);

  // Login function
  const login = async (email, password) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Sync user to MongoDB after successful login
      await syncUserToMongo(userCredential.user);
      // Auth state listener will handle the state update
      return userCredential.user;
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      let errorMessage = 'Login failed. Please check your credentials.';
      
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = 'Invalid email or password';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed login attempts. Please try again later.';
      }
      
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  // Sign up function
  const signUp = async (userData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        userData.email, 
        userData.password
      );
      
      const user = userCredential.user;
      
      // Update profile with display name
      await updateProfile(user, {
        displayName: `${userData.firstName} ${userData.lastName}`
      });
      
      // Store additional user data in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone,
        country: userData.country || '',
        city: userData.city || '',
        street: userData.street || '',
        createdAt: new Date().toISOString(),
        authProvider: 'email'
      });
      
      // Sync user to MongoDB after successful signup
      await syncUserToMongo(user);
      // Auth state listener will handle the state update
      return user;
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      let errorMessage = 'Signup failed. Please try again.';
      
      console.log('Signup error code:', error.code);
      console.log('Signup error message:', error.message);
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Email is already in use. Please use a different email or login.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please use a stronger password (at least 6 characters).';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.';
      } else if (error.code === 'auth/operation-not-allowed') {
        errorMessage = 'Email/password accounts are not enabled. Please contact support.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your internet connection.';
      } else if (error.message) {
        // Use the error message if available
        errorMessage = error.message;
      }
      
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  // Google sign-in function
  const signInWithGoogle = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });
    try {
      // Import the pre-configured Google provider
      const { googleProvider } = await import('../firebase');
      
      // Add additional scopes if needed
      googleProvider.addScope('profile');
      googleProvider.addScope('email');
      
      // Use native GoogleAuth plugin for mobile WebView, popup for desktop
      if (isMobileWebView()) {
        console.log('Using native Google sign-in for mobile');
        const { GoogleAuth } = await import('@codetrix-studio/capacitor-google-auth');
        await GoogleAuth.initialize({
          clientId: '552189348251-93esjcu95at9ji45ugnddd60nistmqb6.apps.googleusercontent.com',
          scopes: ['profile', 'email']
        });
        const googleUser = await GoogleAuth.signIn();
        const credential = GoogleAuthProvider.credential(googleUser.authentication.idToken);
        const userCredential = await signInWithCredential(auth, credential);
        const user = userCredential.user;

        // Check if user exists in Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));

        const names = user.displayName ? user.displayName.split(' ') : ['', ''];
        const firstName = names[0] || '';
        const lastName = names.length > 1 ? names.slice(1).join(' ') : '';

        if (!userDoc.exists()) {
          // Store user data in Firestore if it's a new user
          await setDoc(doc(db, 'users', user.uid), {
            firstName,
            lastName,
            email: user.email,
            phone: user.phoneNumber || '',
            photoURL: user.photoURL || '',
            country: '',
            city: '',
            street: '',
            createdAt: new Date().toISOString(),
            authProvider: 'google'
          });
        } else {
          // Update missing name fields for existing users
          const data = userDoc.data();
          const updates = {};
          if (!data.firstName && firstName) updates.firstName = firstName;
          if (!data.lastName && lastName) updates.lastName = lastName;
          if (Object.keys(updates).length > 0) {
            await setDoc(doc(db, 'users', user.uid), updates, { merge: true });
          }
        }

        // Sync user to MongoDB after successful Google sign-in
        await syncUserToMongo(user);
        return user;
      } else {
        console.log('Using popup sign-in for desktop');
        const userCredential = await signInWithPopup(auth, googleProvider);
        const user = userCredential.user;

        // Check if user exists in Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));

        const names = user.displayName ? user.displayName.split(' ') : ['', ''];
        const firstName = names[0] || '';
        const lastName = names.length > 1 ? names.slice(1).join(' ') : '';

        if (!userDoc.exists()) {
          // Store user data in Firestore if it's a new user
          await setDoc(doc(db, 'users', user.uid), {
            firstName,
            lastName,
            email: user.email,
            phone: user.phoneNumber || '',
            photoURL: user.photoURL || '',
            country: '',
            city: '',
            street: '',
            createdAt: new Date().toISOString(),
            authProvider: 'google'
          });
        } else {
          // Update missing name fields for existing users
          const data = userDoc.data();
          const updates = {};
          if (!data.firstName && firstName) updates.firstName = firstName;
          if (!data.lastName && lastName) updates.lastName = lastName;
          if (Object.keys(updates).length > 0) {
            await setDoc(doc(db, 'users', user.uid), updates, { merge: true });
          }
        }

        // Sync user to MongoDB after successful Google sign-in
        await syncUserToMongo(user);
        return user;
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
      let errorMessage = 'Google sign-in failed. Please try again.';
      
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Sign-in popup was closed. Please try again.';
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = 'Sign-in popup was blocked. Please allow popups for this site.';
      } else if (error.code === 'auth/unauthorized-domain') {
        errorMessage = 'This domain is not authorized for Google sign-in. Please contact support.';
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        errorMessage = 'An account already exists with the same email address but different sign-in credentials.';
      }
      
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await signOut(auth);
      // Auth state listener will handle the state update
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      dispatch({ type: 'SET_ERROR', payload: 'Logout failed. Please try again.' });
      throw error;
    }
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

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