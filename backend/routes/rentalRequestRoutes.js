const express = require('express');
const { uploadNewRentalRequest, getRentalRequests, getUserRentalRequests, searchRentalRequests, filterRentalRequests, deleteRentalRequest } = require('../controllers/rentalRequestController.js');
const { protect } = require('../middleware/authMiddleware.js');
const upload = require('../middleware/upload');

const router = express.Router();

// Protected route
router.post('/', protect, upload.array('images', 5), uploadNewRentalRequest);
router.get('/', getRentalRequests);
router.get('/user', protect, getUserRentalRequests);
router.delete('/:id', protect, deleteRentalRequest);
router.get("/search", searchRentalRequests);
router.get('/filter', filterRentalRequests);

module.exports = router;