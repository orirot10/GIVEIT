const express = require('express');
const router = express.Router();

// Deprecated: messaging APIs now live under /api/conversations
router.all('*', (_req, res) => res.status(410).json({ message: 'deprecated' }));

module.exports = router;
