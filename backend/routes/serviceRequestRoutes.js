const express = require('express');
const {
    getServiceRequests,
    getUserServiceRequests,
    searchServiceRequests,
    filterServiceRequests
} = require('../controllers/serviceRequestController');
const requireAuth = require('../middleware/authMiddleware.js');

const router = express.Router();

// GET /api/service_requests - Fetch all service requests
router.get('/', getServiceRequests);

// GET /api/service_requests/user - Fetch service requests for the logged-in user
router.get('/user', requireAuth, getUserServiceRequests);

// GET /api/service_requests/search?query=... - Search service requests
router.get('/search', searchServiceRequests);

// GET /api/service_requests/filter?category=...&maxPrice=... - Filter service requests
router.get('/filter', filterServiceRequests);

module.exports = router; 