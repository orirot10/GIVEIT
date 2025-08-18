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

// Update FCM token
router.post('/fcm-token', protect, async (req, res) => {
  try {
    const { fcmToken } = req.body;
    
    const user = await User.findOneAndUpdate(
      { firebaseUid: req.user.uid },
      { fcmToken },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'FCM token updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;