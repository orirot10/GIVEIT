const { auth, db } = require('../config/firebase');
const User = require('../models/User');

// Verify Google token
exports.verifyGoogleToken = async (req, res) => {
  const { token } = req.body;
  try {
    console.log('Verifying Google token...');
    // Verify the token with Firebase Admin SDK
    const decodedToken = await auth.verifyIdToken(token);
    const { email, name, uid } = decodedToken;
    console.log('Google user verified:', uid, email);

    // Check if user exists in MongoDB
    let user = await User.findOne({ firebaseUid: uid });
    console.log('MongoDB user found:', !!user);
    
    if (!user) {
      console.log('Creating new MongoDB user for Google sign-in...');
      // Create a new user in MongoDB
      user = await User.create({
        firebaseUid: uid,
        email,
        firstName: name?.split(' ')[0] || '',
        lastName: name?.split(' ').slice(1).join(' ') || '',
        photoURL: decodedToken.picture || ''
      });
      console.log('MongoDB user created:', user._id);
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('Google token verification error:', error);
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

    // Store user data in MongoDB
    const mongoUser = await User.create({
      firebaseUid: userRecord.uid,
      email,
      firstName,
      lastName,
      phone: phone || '',
      country: country || '',
      city: city || '',
      street: street || ''
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
      mongoUser,
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
    
    // Find or create user in MongoDB
    let mongoUser = await User.findOne({ firebaseUid: userRecord.uid });
    if (!mongoUser) {
      mongoUser = await User.create({
        firebaseUid: userRecord.uid,
        email: userRecord.email,
        firstName: userRecord.displayName?.split(' ')[0] || '',
        lastName: userRecord.displayName?.split(' ').slice(1).join(' ') || ''
      });
    }
    
    // Get user data from Firestore
    const userData = await db.collection('users').doc(userRecord.uid).get();
    
    res.status(200).json({
      message: 'Login successful',
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
        ...userData.data()
      },
      mongoUser
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

// Sync user data (called from frontend after authentication)
exports.syncUser = async (req, res) => {
  try {
    const { uid, email, displayName, provider } = req.body;
    console.log('Sync user request:', { uid, email, displayName, provider });
    
    // Find or create user in MongoDB
    let mongoUser = await User.findOne({ firebaseUid: uid });
    console.log('Existing MongoDB user:', !!mongoUser);
    
    if (!mongoUser) {
      console.log('Creating new MongoDB user via sync...');
      mongoUser = await User.create({
        firebaseUid: uid,
        email,
        firstName: displayName?.split(' ')[0] || '',
        lastName: displayName?.split(' ').slice(1).join(' ') || '',
        authProvider: provider || 'unknown'
      });
      console.log('MongoDB user created via sync:', mongoUser._id);
    }
    
    res.status(200).json({ mongoUser });
  } catch (error) {
    console.error('Sync user error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Test endpoint to check MongoDB connection
exports.testMongo = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const testUser = await User.create({
      firebaseUid: 'test-' + Date.now(),
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User'
    });
    await User.findByIdAndDelete(testUser._id);
    
    res.status(200).json({ 
      message: 'MongoDB connection working',
      userCount,
      testCreated: true
    });
  } catch (error) {
    console.error('MongoDB test error:', error);
    res.status(500).json({ error: error.message });
  }
};