const { initializeApp, cert } = require('firebase-admin/app');
const { getStorage } = require('firebase-admin/storage');
const serviceAccount = require('./backend/config/serviceAccountKey.json');

// Initialize Firebase Admin
initializeApp({
  credential: cert(serviceAccount),
  storageBucket: 'giveit-3003.appspot.com'
});

async function setCorsConfiguration() {
  try {
    const bucket = getStorage().bucket();
    
    await bucket.setCorsConfiguration([
      {
        origin: ['*'],
        method: ['GET', 'HEAD', 'POST', 'PUT', 'OPTIONS'],
        maxAgeSeconds: 3600,
        responseHeader: ['Content-Type', 'Authorization', 'x-goog-resumable']
      }
    ]);
    
    console.log('CORS configuration updated successfully!');
  } catch (error) {
    console.error('Error updating CORS:', error);
  }
}

setCorsConfiguration();