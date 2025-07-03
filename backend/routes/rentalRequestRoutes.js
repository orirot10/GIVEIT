const express = require('express');
// Import functions from the new controller
const {
    uploadNewRentalRequest,
    getRentalRequests,
    getUserRentalRequests,
    searchRentalRequests,
    filterRentalRequests,
    deleteRentalRequest,
    editRentalRequest
} = require('../controllers/rentalRequestController'); // Corrected path
const { protect: requireAuth } = require('../middleware/authMiddleware.js');
const upload = require('../middleware/upload');
const RentalRequest = require('../models/RentalRequest');

const router = express.Router();

// Test route to create a rental request
router.post('/test', async (req, res) => {
    try {
        const testRequest = new RentalRequest({
            firstName: 'Test',
            lastName: 'User',
            email: 'test@example.com',
            title: 'Test Rental Request',
            description: 'This is a test rental request',
            category: 'Electronics',
            price: 100,
            phone: '0501234567',
            city: 'Tel Aviv',
            street: 'Test Street'
        });
        await testRequest.save();
        res.status(201).json(testRequest);
    } catch (err) {
        console.error('Error creating test rental request:', err);
        res.status(500).json({ error: 'Failed to create test rental request' });
    }
});

// Protected routes
router.post('/', requireAuth, upload.array('images', 5), uploadNewRentalRequest);
router.post('/with-urls', requireAuth, uploadNewRentalRequest);
router.get('/', getRentalRequests);
router.get('/user', requireAuth, getUserRentalRequests);
router.get('/search', searchRentalRequests);
router.get('/filter', filterRentalRequests);
router.delete('/:id', requireAuth, deleteRentalRequest);
router.put('/:id', requireAuth, editRentalRequest);

// Remove or comment out unused routes like the old :type route
// router.get('/:type', getRentalRequestsByType); // This was likely incorrect

// Future: Add routes for creating, updating, deleting rental requests if needed
// Example:
// router.post('/', requireAuth, createRentalRequest);
// router.put('/:id', requireAuth, updateRentalRequest);
// router.delete('/:id', requireAuth, deleteRentalRequest);

module.exports = router; 