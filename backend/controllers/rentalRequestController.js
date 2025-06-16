const RentalRequest = require('../models/RentalRequest');

const uploadNewRentalRequest = async (req, res) => {
    console.log('Received rental request:', req.body);
    console.log('Files:', req.files);
    console.log('User:', req.user);

    const {
        title,
        description,
        category,
        price,
        pricePeriod,
        phone,
        status,
        city,
        street
    } = req.body;

    if (!req.user) {
        console.log('No user found in request');
        return res.status(401).json({ error: 'Unauthorized. User data missing.' });
    }

    try {
        // Get uploaded file paths
        const imagePaths = req.files?.map(file => `/uploads/${file.filename}`) || [];
        console.log('Image paths:', imagePaths);

        const newRentalRequest = await RentalRequest.create({
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            email: req.user.email,
            ownerId: req.user.id,
            title,
            description,
            category,
            price,
            pricePeriod,
            images: imagePaths,
            phone,
            status,
            city,
            street
        });

        console.log('Created rental request:', newRentalRequest);
        res.status(201).json(newRentalRequest);
    } catch (error) {
        console.error('Error creating rental request:', error);
        res.status(400).json({ error: error.message });
    }
};

// Get all rental requests
const getRentalRequests = async (req, res) => {
    try {
        const requests = await RentalRequest.find()
            .select('firstName lastName email title description category price pricePeriod images phone status city street ownerId')
            .sort({ createdAt: -1 });
        res.status(200).json(requests);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch rental requests' });
    }
};

// Get rental requests for a specific user
const getUserRentalRequests = async (req, res) => {
    const { email } = req.user; // set by auth middleware
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit); // optionally support a custom limit

    console.log('Fetching rental requests for user:', email);
    console.log('Auth user data:', req.user);

    try {
        let query = RentalRequest.find({ email }).sort({ createdAt: -1 });

        // Only apply pagination if `page` and `limit` are provided
        if (!isNaN(page) && !isNaN(limit)) {
            query = query.skip((page - 1) * limit).limit(limit);
        }

        const requests = await query;
        console.log('Found rental requests:', requests.length);
        res.status(200).json(requests);
    } catch (err) {
        console.error('Error fetching user rental requests:', err);
        res.status(500).json({ error: 'Failed to fetch user rental requests' });
    }
};

// Search rental requests
const searchRentalRequests = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query || query.trim() === "") {
            return res.status(400).json({ message: "Query is required." });
        }

        // Split words for ordered search
        const words = query.trim().split(/\s+/);

        // Create a case-insensitive, ordered regex pattern
        const regexPattern = words.join(".*"); // e.g. "bike red" => /bike.*red/
        const regex = new RegExp(regexPattern, "i");

        const results = await RentalRequest.find({
            title: { $regex: regex },
        });

        res.status(200).json(results);
    } catch (err) {
        console.error("Search error:", err);
        res.status(500).json({ message: "Server error during search." });
    }
};

// Filter rental requests
const filterRentalRequests = async (req, res) => {
    try {
        const { category, minPrice, maxPrice } = req.query;

        const query = {};
        
        if (category) {
            const categoriesArray = Array.isArray(category)
                ? category
                : category.split(',');
            query.category = { $in: categoriesArray };
        }

        // Handle price range
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = parseFloat(minPrice);
            if (maxPrice) query.price.$lte = parseFloat(maxPrice);
        }

        const requests = await RentalRequest.find(query);
        res.status(200).json(requests);
    } catch (err) {
        res.status(500).json({ error: "Failed to filter rental requests", details: err.message });
    }
};

// Delete a rental request
const deleteRentalRequest = async (req, res) => {
    const { id } = req.params;

    try {
        const deleted = await RentalRequest.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ error: 'Rental request not found' });

        res.status(200).json({ message: 'Rental request deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete rental request' });
    }
};

module.exports = {
    uploadNewRentalRequest,
    getRentalRequests,
    getUserRentalRequests,
    searchRentalRequests,
    filterRentalRequests,
    deleteRentalRequest
}; 