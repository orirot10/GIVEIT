const { auth } = require('../config/firebase');

const protect = async (req, res, next) => {
  try {
    // Check if authorization header exists
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Not authorized, no token' });
    }

    // Get token from header
    const token = req.headers.authorization.split(' ')[1];

    // Verify token
    const decodedToken = await auth.verifyIdToken(token);
    
    // Add user info to request
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ error: 'Not authorized, token failed' });
  }
};

module.exports = { protect };