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
        street,
        lat,
        lng
    } = req.body;

    if (!req.user) {
        console.log('No user found in request');
        return res.status(401).json({ error: 'Unauthorized. User data missing.' });
    }

    try {
        const { images } = req.body;
        let imagePaths = [];
        
        if (req.files && req.files.length > 0) {
            // Traditional file upload
            imagePaths = req.files.map(file => `/uploads/${file.filename}`);
        } else if (images && Array.isArray(images)) {
            // Firebase Storage URLs from frontend
            imagePaths = images;
        } else if (images && typeof images === 'string') {
            imagePaths = [images];
        }
        
        console.log('Image paths:', imagePaths);

        const newRentalRequest = await RentalRequest.create({
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            email: req.user.email,
            ownerId: req.user.mongoUser._id,
            title,
            description,
            category,
            price,
            pricePeriod,
            images: imagePaths,
            phone,
            status,
            city,
            street,
            lat: lat ? parseFloat(lat) : undefined,
            lng: lng ? parseFloat(lng) : undefined
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
        const { lat, lng, radius } = req.query;
        let query = {};
        if (lat && lng && radius) {
            const userLat = parseFloat(lat);
            const userLng = parseFloat(lng);
            const maxDistance = parseFloat(radius) || 1000;
            query = {
                lat: { $exists: true, $ne: null },
                lng: { $exists: true, $ne: null },
                $expr: {
                    $lte: [
                        {
                            $multiply: [
                                6371000,
                                { $acos: {
                                    $add: [
                                        { $multiply: [ { $sin: { $degreesToRadians: userLat } }, { $sin: { $degreesToRadians: "$lat" } } ] },
                                        { $multiply: [ { $cos: { $degreesToRadians: userLat } }, { $cos: { $degreesToRadians: "$lat" } }, { $cos: { $subtract: [ { $degreesToRadians: "$lng" }, { $degreesToRadians: userLng } ] } } ] }
                                    ]
                                }}
                            ]
                        },
                        maxDistance
                    ]
                }
            };
        }
        const requests = await RentalRequest.find(query)
            .select('firstName lastName email title description category price pricePeriod images phone status city street ownerId lat lng')
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

// Edit a rental request
const editRentalRequest = async (req, res) => {
    const { id } = req.params;
    const { title, description, category, price, pricePeriod, images, phone, status, city, street, lat, lng } = req.body;
    try {
        const updated = await RentalRequest.findByIdAndUpdate(
            id,
            { title, description, category, price, pricePeriod, images, phone, status, city, street, lat, lng },
            { new: true }
        );
        if (!updated) return res.status(404).json({ error: 'Rental request not found' });
        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update rental request' });
    }
};

module.exports = {
    uploadNewRentalRequest,
    getRentalRequests,
    getUserRentalRequests,
    searchRentalRequests,
    filterRentalRequests,
    deleteRentalRequest,
    editRentalRequest
}; 