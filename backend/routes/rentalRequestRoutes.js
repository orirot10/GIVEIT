const express = require('express');
const { uploadNewRentalRequest, getRentalRequests, getUserRentalRequests, searchRentalRequests, filterRentalRequests, deleteRentalRequest } = require('../controllers/rentalRequestController.js');
const requireAuth = require('../middleware/authMiddleware.js');
const upload = require('../middleware/upload');

const router = express.Router();

// Protected route
router.post('/', requireAuth, upload.array('images', 5), uploadNewRentalRequest);
router.get('/', getRentalRequests);
router.get('/user', requireAuth, getUserRentalRequests);
router.delete('/:id', requireAuth, deleteRentalRequest);
router.get("/search", searchRentalRequests);
router.get('/filter', filterRentalRequests);

module.exports = router;