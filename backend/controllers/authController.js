const { auth, db } = require('../config/firebase');
const User = require('../models/User');
const admin = require('firebase-admin'); // or use firebase/auth if using client SDK

// Verify Google token
exports.verifyGoogleToken = async (req, res) => {
  const { token } = req.body;
  try {
    // Verify the token with Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(token);
    const { email, name, uid } = decodedToken;

    // Check if user exists in MongoDB
    let user = await User.findOne({ email });
    if (!user) {
      // If not, create a new user
      user = await User.create({
        email,
        name,
        firebaseUid: uid,
        // add other fields as needed
      });
    }

    // Generate your own JWT or session here if needed
    //

    res.status(200).json({ user });
  } catch (error) {
    res.status(401).json({ message: 'Invalid Google token', error: error.message });
  }
};

// Register a new user
exports.register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone, country, city, street } = req.body;

    // Create user in Firebase Authentication
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: `${firstName} ${lastName}`,
    });

    // Store additional user data in Firestore
    await db.collection('users').doc(userRecord.uid).set({
      firstName,
      lastName,
      email,
      phone,
      country: country || '',
      city: city || '',
      street: street || '',
      createdAt: new Date().toISOString(),
    });

    // Generate custom token for frontend authentication
    const token = await auth.createCustomToken(userRecord.uid);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ error: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // This is just for verification - actual authentication happens on the client side
    const userRecord = await auth.getUserByEmail(email);
    
    // Get user data from Firestore
    const userData = await db.collection('users').doc(userRecord.uid).get();
    
    res.status(200).json({
      message: 'Login successful',
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
        ...userData.data()
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({ error: 'Invalid credentials' });
  }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.uid;
    const userRecord = await auth.getUser(userId);
    
    // Get user data from Firestore
    const userData = await db.collection('users').doc(userId).get();
    
    res.status(200).json({
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
        ...userData.data()
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: error.message });
  }
};