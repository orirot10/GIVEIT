const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  openConversation,
  listConversations,
  getMessages,
  sendMessage,
  markAsRead,
  debugUnread,
} = require('../controllers/messageController');

const router = express.Router();

router.post('/open', protect, openConversation);
router.get('/', protect, listConversations);
router.get('/:conversationId/messages', protect, getMessages);
router.post('/:conversationId/messages', protect, sendMessage);
router.post('/:conversationId/read', protect, markAsRead);
router.get('/debug/unread/:conversationId', protect, debugUnread);

module.exports = router;
