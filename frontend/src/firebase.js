// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Validate API key
const validateApiKey = (apiKey) => {
  if (!apiKey) {
    throw new Error('Firebase API key is missing. Please check your environment variables.');
  }
  if (!apiKey.startsWith('AIza')) {
    throw new Error('Invalid Firebase API key format. Please check your configuration.');
  }
  return apiKey;
};

// Get environment variables with fallback and logging
const getEnvVar = (key, defaultValue) => {
  const value = import.meta.env[key] || defaultValue;
  console.log(`Env var ${key}:`, value);
  return value;
};

// Your Firebase configuration
const firebaseConfig = {
  apiKey: validateApiKey(getEnvVar('VITE_FIREBASE_API_KEY', "AIzaSyAWr38uLJMbrvH-5bQx-waR3zijfosLPVA")),
  authDomain: getEnvVar('VITE_FIREBASE_AUTH_DOMAIN', "giveit-3003.firebaseapp.com"),
  projectId: getEnvVar('VITE_FIREBASE_PROJECT_ID', "giveit-3003"),
  storageBucket: getEnvVar('VITE_FIREBASE_STORAGE_BUCKET', "giveit-3003.appspot.com"),
  messagingSenderId: getEnvVar('VITE_FIREBASE_MESSAGING_SENDER_ID', "316217749502"),
  appId: getEnvVar('VITE_FIREBASE_APP_ID', "1:316217749502:web:3f035faa1c9f9948bc5aaf"),
  measurementId: getEnvVar('VITE_FIREBASE_MEASUREMENT_ID', "G-RZ19ZYET7Z")
};

// Initialize Firebase with error handling
let app;
let db;
let auth;

try {
  console.log('Initializing Firebase with config:', {
    ...firebaseConfig,
    apiKey: firebaseConfig.apiKey.substring(0, 10) + '...' // Log only part of the API key for security
  });
  
  app = initializeApp(firebaseConfig);
  console.log('Firebase app initialized');
  
  // Initialize Firestore
  try {
    db = getFirestore(app);
    console.log('Firestore initialized');
  } catch (dbError) {
    console.error('Error initializing Firestore:', dbError);
  }

  // Initialize Auth
  try {
    auth = getAuth(app);
    console.log('Auth initialized');
  } catch (authError) {
    console.error('Error initializing Auth:', authError);
  }
} catch (error) {
  console.error('Error initializing Firebase:', error);
  if (error.code === 'app/duplicate-app') {
    console.warn('Firebase app already initialized');
    app = initializeApp(firebaseConfig, 'secondary');
  } else {
    throw new Error('Failed to initialize Firebase. Please check your configuration and make sure Authentication is enabled in your Firebase Console.');
  }
}

export { db, auth };