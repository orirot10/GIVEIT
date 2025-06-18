const admin = require('firebase-admin');
require('dotenv').config();

// Initialize Firebase Admin with a more robust approach
try {
  // Check if Firebase is already initialized
  if (admin.apps.length === 0) {
    // Get service account from environment variable
    const serviceAccountEnv = process.env.FIREBASE_SERVICE_ACCOUNT;
    
    if (serviceAccountEnv) {
      // Create a credential from the environment variable
      const serviceAccount = JSON.parse(serviceAccountEnv);
      
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: process.env.FIREBASE_DATABASE_URL,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET
      });
      
      console.log('Firebase Admin initialized successfully from environment variable');
    } else {
      // Try to use local service account file as fallback
      try {
        const serviceAccount = require('../serviceAccountKey.json');
        
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          databaseURL: process.env.FIREBASE_DATABASE_URL,
          storageBucket: process.env.FIREBASE_STORAGE_BUCKET
        });
        
        console.log('Firebase Admin initialized successfully from local file');
      } catch (fileError) {
        console.error('Failed to initialize Firebase: No service account available');
        // Initialize with a minimal config to prevent crashes
        admin.initializeApp({
          projectId: 'dummy-project'
        });
        console.warn('⚠️ Using dummy Firebase configuration. Authentication will not work properly!');
      }
    }
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

// Export the initialized services
const db = admin.firestore();
const auth = admin.auth();

module.exports = { admin, db, auth };