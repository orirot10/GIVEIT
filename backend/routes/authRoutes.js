const express = require('express');
const router = express.Router();
const { register, login, getCurrentUser, verifyGoogleToken, syncUser, testMongo } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Register a new user
router.post('/register', register);

// Login user
router.post('/login', login);

// Verify Google token
router.post('/google', verifyGoogleToken);

// Get current user (protected route)
router.get('/me', protect, getCurrentUser);

// Sync user data to MongoDB
router.post('/sync', syncUser);

// Test MongoDB connection
router.get('/test-mongo', testMongo);

module.exports = router;