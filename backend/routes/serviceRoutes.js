const express = require('express');
const router = express.Router();
const { uploadNewService, getServices, getUserServices, editService, deleteService, searchServices, filterServices } = require('../controllers/serviceController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload.js');


router.post('/', protect, upload.array('images'), uploadNewService); // POST /api/services
router.get('/', getServices); // GET /api/services
router.get('/user', protect, getUserServices); // GET /api/services/user
router.put('/:id', protect, editService); // PUT /api/services/:id
router.delete('/:id', protect, deleteService); // DELETE /api/services/:id
router.get("/search", searchServices);
router.get('/filter', filterServices); // GET /api/services/filter?category=Electronics&maxPrice=150

module.exports = router;