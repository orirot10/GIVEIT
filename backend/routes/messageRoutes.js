const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getMessagesHttp, sendMessageHttp } = require('../controllers/messageController');

const router = express.Router();

router.get('/:conversationId', protect, getMessagesHttp);
router.post('/', protect, sendMessageHttp);

module.exports = router;
