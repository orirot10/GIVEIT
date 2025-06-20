const { auth, firebaseInitialized } = require('../config/firebase');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    // Check if Firebase is properly initialized
    if (!firebaseInitialized) {
      console.warn('Firebase not properly initialized, skipping authentication');
      // For development only - add a mock user
      if (process.env.NODE_ENV !== 'production') {
        req.user = { uid: 'dev-user-id', email: 'dev@example.com' };
        return next();
      } else {
        return res.status(503).json({ 
          error: 'Authentication service unavailable',
          message: 'The authentication service is currently unavailable. Please try again later.'
        });
      }
    }

    // Check if authorization header exists
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Not authorized', 
        message: 'Authentication required. Please log in.'
      });
    }

    // Get token from header
    const token = req.headers.authorization.split(' ')[1];

    try {
      // Verify token
      const decodedToken = await auth.verifyIdToken(token);
      
      // Find or create user in MongoDB
      let mongoUser = await User.findOne({ firebaseUid: decodedToken.uid });
      
      if (!mongoUser) {
        // Create user in MongoDB if doesn't exist
        mongoUser = new User({
          firebaseUid: decodedToken.uid,
          email: decodedToken.email,
          firstName: decodedToken.name?.split(' ')[0] || '',
          lastName: decodedToken.name?.split(' ').slice(1).join(' ') || '',
          photoURL: decodedToken.picture || ''
        });
        await mongoUser.save();
      }
      
      // Add user info to request
      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        mongoUser
      };

      next();
    } catch (tokenError) {
      console.error('Token verification error:', tokenError.message);
      return res.status(401).json({ 
        error: 'Invalid token', 
        message: 'Your session has expired. Please log in again.'
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ 
      error: 'Authentication error',
      message: 'An error occurred during authentication. Please try again.'
    });
  }
};

module.exports = { protect };