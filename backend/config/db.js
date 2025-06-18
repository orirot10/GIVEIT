const { db } = require('./firebase');

const connectDB = async () => {
  try {
    // Test connection to Firestore
    await db.collection('test').doc('connection').set({
      timestamp: new Date().toISOString(),
      status: 'connected'
    });
    console.log('Connected to Firebase Firestore');
    
    // Clean up test document
    await db.collection('test').doc('connection').delete();
  } catch (err) {
    console.error('Firebase connection error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;