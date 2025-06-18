const { auth, db } = require('../config/firebase');

// Verify Google token
exports.verifyGoogleToken = async (req, res) => {
  try {
    const { idToken } = req.body;
    
    // Verify the ID token
    const decodedToken = await auth.verifyIdToken(idToken);
    const uid = decodedToken.uid;
    
    // Get user record
    const userRecord = await auth.getUser(uid);
    
    // Check if user exists in Firestore
    const userDoc = await db.collection('users').doc(uid).get();
    
    if (!userDoc.exists) {
      // Create user document if it doesn't exist
      const names = userRecord.displayName ? userRecord.displayName.split(' ') : ['', ''];
      const firstName = names[0] || '';
      const lastName = names.length > 1 ? names.slice(1).join(' ') : '';
      
      await db.collection('users').doc(uid).set({
        firstName,
        lastName,
        email: userRecord.email,
        phone: userRecord.phoneNumber || '',
        country: '',
        city: '',
        street: '',
        createdAt: new Date().toISOString(),
        authProvider: 'google'
      });
    }
    
    // Get updated user data
    const updatedUserDoc = userDoc.exists ? userDoc : await db.collection('users').doc(uid).get();
    
    res.status(200).json({
      message: 'Google authentication successful',
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
        ...updatedUserDoc.data()
      }
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(401).json({ error: 'Invalid Google token' });
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