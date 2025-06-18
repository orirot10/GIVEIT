const admin = require('firebase-admin');
require('dotenv').config();

// Initialize Firebase Admin
let serviceAccount;

try {
  // Try to get service account from environment variable first
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } else {
    // Fall back to local file if available
    try {
      serviceAccount = require('../serviceAccountKey.json');
    } catch (err) {
      console.error('No service account found in env or file. Please set up Firebase credentials.');
      console.error('See FIREBASE_SETUP.md for instructions.');
    }
  }

  // Initialize the app if we have credentials
  if (serviceAccount && !admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('Firebase Admin initialized successfully');
  }
} catch (error) {
  console.error('Error initializing Firebase Admin:', error);
}

const db = admin.firestore();
const auth = admin.auth();

module.exports = { admin, db, auth };