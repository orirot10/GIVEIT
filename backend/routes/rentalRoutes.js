const express = require('express');
const { uploadNewRental, getRentals, getUserRentals, editRental, deleteRental, searchRentals, filterRentals } = require('../controllers/rentalController.js');
const { protect } = require('../middleware/authMiddleware.js');
const upload = require('../middleware/upload');

const router = express.Router();

// Protected route
router.post('/', protect, upload.array('images', 5), uploadNewRental);
router.get('/', getRentals);
router.get('/user', protect, getUserRentals);
router.put('/:id', protect, editRental);
router.delete('/:id', protect, deleteRental);
router.get("/search", searchRentals);
router.get('/filter', filterRentals);

module.exports = router;