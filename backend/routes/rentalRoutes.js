const express = require('express');
const { uploadNewRental, getRentals, getUserRentals, editRental, deleteRental, searchRentals, filterRentals } = require('../controllers/rentalController.js');
const requireAuth = require('../middleware/authMiddleware.js');
const upload = require('../middleware/upload');

const router = express.Router();

// Protected route
router.post('/', requireAuth, upload.array('images', 5), uploadNewRental);
router.get('/', getRentals);
router.get('/user', requireAuth, getUserRentals);
router.put('/:id', requireAuth, editRental);
router.delete('/:id', requireAuth, deleteRental);
router.get("/search", searchRentals);
router.get('/filter', filterRentals);

module.exports = router;