const admin = require('firebase-admin');
require('dotenv').config();

// Initialize Firebase Admin with better error handling
let firebaseInitialized = false;

try {
  // Check if Firebase is already initialized
  if (admin.apps.length === 0) {
    // Get service account from environment variable
    const serviceAccountEnv = process.env.FIREBASE_CREDS_JSON || process.env.FIREBASE_SERVICE_ACCOUNT;
    
    if (serviceAccountEnv) {
      try {
        // Create a credential from the environment variable
        const serviceAccount = JSON.parse(serviceAccountEnv);
        
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          databaseURL: process.env.FIREBASE_DATABASE_URL || `https://${serviceAccount.project_id}.firebaseio.com`,
          storageBucket: process.env.FIREBASE_STORAGE_BUCKET || `${serviceAccount.project_id}.appspot.com`
        });
        
        console.log('Firebase Admin initialized successfully from environment variable');
        firebaseInitialized = true;
      } catch (parseError) {
        console.error('Error parsing Firebase service account:', parseError.message);
        console.error('Make sure FIREBASE_CREDS_JSON is a valid JSON string with escaped newlines (\\n)');
      }
    } else {
      // Try to use local service account file as fallback
      try {
        const serviceAccount = require('../serviceAccountKey.json');
        
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          databaseURL: process.env.FIREBASE_DATABASE_URL || `https://${serviceAccount.project_id}.firebaseio.com`,
          storageBucket: process.env.FIREBASE_STORAGE_BUCKET || `${serviceAccount.project_id}.appspot.com`
        });
        
        console.log('Firebase Admin initialized successfully from local file');
        firebaseInitialized = true;
      } catch (fileError) {
        console.error('Failed to initialize Firebase: No service account available');
      }
    }
    
    // If Firebase still isn't initialized, create a minimal app
    if (!firebaseInitialized && admin.apps.length === 0) {
      admin.initializeApp({
        projectId: 'dummy-project'
      });
      console.warn('⚠️ Using dummy Firebase configuration. Authentication will not work properly!');
    }
  } else {
    firebaseInitialized = true;
  }
} catch (error) {
  console.error('Firebase initialization error:', error);
  
  // If not already initialized, create a minimal app to prevent crashes
  if (admin.apps.length === 0) {
    admin.initializeApp({
      projectId: 'dummy-project'
    });
    console.warn('⚠️ Using dummy Firebase configuration after error. Authentication will not work properly!');
  }
}

// Create safe versions of Firebase services that won't throw errors if Firebase isn't properly initialized
const db = {
  collection: (collectionPath) => {
    try {
      return admin.firestore().collection(collectionPath);
    } catch (error) {
      console.error(`Error accessing Firestore collection ${collectionPath}:`, error.message);
      // Return a dummy object that won't crash when methods are called on it
      return {
        doc: () => ({
          get: async () => ({ exists: false, data: () => ({}) }),
          set: async () => ({}),
          update: async () => ({}),
          delete: async () => ({})
        }),
        get: async () => ({ empty: true, docs: [] }),
        add: async () => ({})
      };
    }
  }
};

const auth = {
  createUser: async () => {
    if (!firebaseInitialized) throw new Error('Firebase Auth not initialized properly');
    return admin.auth().createUser(...arguments);
  },
  getUserByEmail: async (email) => {
    if (!firebaseInitialized) throw new Error('Firebase Auth not initialized properly');
    return admin.auth().getUserByEmail(email);
  },
  getUser: async (uid) => {
    if (!firebaseInitialized) throw new Error('Firebase Auth not initialized properly');
    return admin.auth().getUser(uid);
  },
  verifyIdToken: async (token) => {
    if (!firebaseInitialized) throw new Error('Firebase Auth not initialized properly');
    return admin.auth().verifyIdToken(token);
  },
  createCustomToken: async (uid) => {
    if (!firebaseInitialized) throw new Error('Firebase Auth not initialized properly');
    return admin.auth().createCustomToken(uid);
  }
};

module.exports = { admin, db, auth, firebaseInitialized };