const { db } = require('./firebase');
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGO_URI;
    if (mongoURI) {
      await mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 45000, // 30 שניות
        socketTimeoutMS: 45000           // 45 שניות
      });
      console.log('Connected to MongoDB successfully');
    } else {
      console.warn('⚠️ MongoDB URI not found. MongoDB operations will fail.');
    }
    
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