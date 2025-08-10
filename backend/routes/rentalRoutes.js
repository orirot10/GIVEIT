const express = require('express');
const { uploadNewRental, getRentals, getUserRentals, editRental, deleteRental, searchRentals, filterRentals, rateRental } = require('../controllers/rentalController.js');
const { protect } = require('../middleware/authMiddleware.js');
const upload = require('../middleware/upload');

const router = express.Router();

// Protected routes
// Support both traditional file uploads and Firebase Storage URLs
router.post('/', protect, upload.array('images', 5), uploadNewRental);
// Direct JSON endpoint for Firebase Storage URLs
router.post('/with-urls', protect, uploadNewRental);
router.get('/', getRentals);
router.get('/user', protect, getUserRentals);
router.put('/:id', protect, editRental);
router.delete('/:id', protect, deleteRental);
router.post('/:id/rate', protect, rateRental);
router.get("/search", searchRentals);
router.get('/filter', filterRentals);

module.exports = router;