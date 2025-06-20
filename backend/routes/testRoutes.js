const express = require('express');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Test protected route
router.get('/protected', protect, (req, res) => {
  res.json({
    message: 'Protected route accessed successfully',
    user: {
      uid: req.user.uid,
      email: req.user.email,
      mongoUser: req.user.mongoUser ? {
        id: req.user.mongoUser._id,
        firstName: req.user.mongoUser.firstName,
        lastName: req.user.mongoUser.lastName
      } : null
    }
  });
});

// Test public route
router.get('/public', (req, res) => {
  res.json({
    message: 'Public route accessed successfully',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;