const express = require('express');
const {
    getServiceRequests,
    getUserServiceRequests,
    searchServiceRequests,
    filterServiceRequests,
    uploadNewServiceRequest,
    deleteServiceRequest,
    editServiceRequest
} = require('../controllers/serviceRequestController');
const { protect } = require('../middleware/authMiddleware.js');
const upload = require('../middleware/upload.js');

const router = express.Router();

// POST /api/service_requests - Create a new service request
router.post('/', protect, upload.array('images', 5), uploadNewServiceRequest);
router.post('/with-urls', protect, uploadNewServiceRequest);

// GET /api/service_requests - Fetch all service requests
router.get('/', getServiceRequests);

// GET /api/service_requests/user - Fetch service requests for the logged-in user
router.get('/user', protect, getUserServiceRequests);

// GET /api/service_requests/search?query=... - Search service requests
router.get('/search', searchServiceRequests);

// GET /api/service_requests/filter?category=...&maxPrice=... - Filter service requests
router.get('/filter', filterServiceRequests);

// DELETE /api/service_requests/:id - Delete a service request by ID
router.delete('/:id', protect, deleteServiceRequest);

// PUT /api/service_requests/:id - Edit a service request by ID
router.put('/:id', protect, editServiceRequest);

module.exports = router;