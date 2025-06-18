const { db } = require('./firebase');

const connectDB = async () => {
  try {
    // Test connection to Firestore with error handling
    if (db) {
      try {
        await db.collection('test').doc('connection').set({
          timestamp: new Date().toISOString(),
          status: 'connected'
        });
        console.log('Connected to Firebase Firestore successfully');
        
        // Clean up test document
        await db.collection('test').doc('connection').delete();
      } catch (firestoreError) {
        console.error('Firestore operation error:', firestoreError.message);
        console.warn('⚠️ Server starting with limited Firestore functionality');
      }
    } else {
      console.warn('⚠️ Firestore not available. Database operations will fail.');
    }
  } catch (err) {
    console.error('Database connection error:', err.message);
    // Don't exit process, allow server to start even with DB issues
    console.warn('⚠️ Server starting without database connection');
  }
};

module.exports = connectDB;