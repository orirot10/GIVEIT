const express = require('express');
// Import functions from the new controller
const {
    getRentalRequests,
    searchRentalRequests,
    filterRentalRequests
} = require('../controllers/rentalRequestController'); // Corrected path
// const requireAuth = require('../middleware/authMiddleware.js'); // Uncomment if auth is needed

const router = express.Router();

// GET /api/rental_requests - Fetch all rental requests
router.get('/', getRentalRequests);

// GET /api/rental_requests/search?query=... - Search rental requests
router.get('/search', searchRentalRequests);

// GET /api/rental_requests/filter?category=...&maxPrice=... - Filter rental requests
router.get('/filter', filterRentalRequests);

// Remove or comment out unused routes like the old :type route
// router.get('/:type', getRentalRequestsByType); // This was likely incorrect

// Future: Add routes for creating, updating, deleting rental requests if needed
// Example:
// router.post('/', requireAuth, createRentalRequest);
// router.put('/:id', requireAuth, updateRentalRequest);
// router.delete('/:id', requireAuth, deleteRentalRequest);

module.exports = router; 