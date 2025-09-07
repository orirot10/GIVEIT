const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User');

const router = express.Router();

// Get user profile
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { firstName, lastName, phone, city, street, country, photoURL } = req.body;
    
    const user = await User.findOneAndUpdate(
      { firebaseUid: req.user.uid },
      {
        firstName,
        lastName,
        phone,
        city,
        street,
        country,
        photoURL
      },
      { new: true, upsert: true }
    );
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Save push token (FCM or APNs)
router.post('/push-token', protect, async (req, res) => {
  try {
    const { token, platform } = req.body;
    if (!token || !platform) {
      return res.status(400).json({ message: 'token and platform are required' });
    }
    const user = await User.findOne({ firebaseUid: req.user.uid });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const existing = user.pushTokens.find(
      (t) => t.token === token && t.platform === platform
    );
    if (existing) {
      existing.updatedAt = new Date();
    } else {
      user.pushTokens.push({ token, platform, updatedAt: new Date() });
    }
    await user.save();
    res.json({ message: 'Push token saved' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
