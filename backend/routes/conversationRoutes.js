const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { listConversations, markAsRead, unreadTotal } = require('../controllers/messageController');

const router = express.Router();

router.get('/', protect, listConversations);
router.get('/unread-total', protect, unreadTotal);
router.post('/:conversationId/read', protect, markAsRead);

module.exports = router;
