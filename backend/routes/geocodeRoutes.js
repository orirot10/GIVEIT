const express = require('express');
const router = express.Router();
const { geocodeAddress } = require('../controllers/geocodeController');
router.post('/geocode', geocodeAddress);
module.exports = router; 