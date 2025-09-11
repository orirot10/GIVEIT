const { initializeApp, cert } = require('firebase-admin/app');
const { getStorage } = require('firebase-admin/storage');
const serviceAccount = require('./backend/config/serviceAccountKey.json');

// Initialize Firebase Admin
initializeApp({
  credential: cert(serviceAccount),
  storageBucket: 'giveit-3003.appspot.com'
});

async function initializeStorage() {
  try {
    const bucket = getStorage().bucket();
    
    // Create a test file to initialize the bucket
    const file = bucket.file('test.txt');
    await file.save('Storage initialized');
    
    console.log('Storage bucket initialized successfully!');
    
    // Now set CORS configuration
    await bucket.setCorsConfiguration([
      {
        origin: ['*'],
        method: ['GET', 'HEAD', 'POST', 'PUT', 'OPTIONS'],
        maxAgeSeconds: 3600,
        responseHeader: ['Content-Type', 'Authorization', 'x-goog-resumable']
      }
    ]);
    
    console.log('CORS configuration set successfully!');
    
    // Clean up test file
    await file.delete();
    console.log('Test file cleaned up');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

initializeStorage();