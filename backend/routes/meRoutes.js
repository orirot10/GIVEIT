const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getUnreadTotal } = require('../controllers/messageController');

const router = express.Router();

router.get('/unread_total', protect, getUnreadTotal);

module.exports = router;
