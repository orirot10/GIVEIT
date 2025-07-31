const Rental = require('../models/Rental.js');
const User = require('../models/User');

const uploadNewRental = async (req, res) => {
    const {
    title,
    description,
    category,
    price,
    pricePeriod,
    firstName,
    lastName,
    phone,
    status,
    city,
    street,
    location,
    images,
    lat,
    lng
    } = req.body;

    if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized. User data missing.' });
    }

    try {
    // Handle both file uploads and Firebase Storage URLs
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

    const newRental = await Rental.create({
        firstName: firstName || req.user.mongoUser?.firstName || req.user.firstName,
        lastName: lastName || req.user.mongoUser?.lastName || req.user.lastName,
        email: req.user.email,
        ownerId: req.user.uid,
        firebaseUid: req.user.uid,
        title,
        description,
        category,
        price: parseFloat(price),
        pricePeriod,
        images: imagePaths,
        phone,
        status: status || 'available',
        city,
        street,
        location: location || city,
        lat: lat ? parseFloat(lat) : undefined,
        lng: lng ? parseFloat(lng) : undefined
    });

    res.status(201).json(newRental);
    } catch (error) {
    res.status(400).json({ error: error.message });
    }
};

// Get all rentals
const getRentals = async (req, res) => {
    try {
        const { lat, lng, radius, minLat, maxLat, minLng, maxLng, limit = 200 } = req.query;
        let query = {};
        let rentals = [];
        // Only select fields needed for the map/popup
        let selectFields = 'firstName lastName email title description category price pricePeriod images phone status city street ownerId lat lng';
        // Bounding box filter (fast, uses index)
        if (
            minLat !== undefined && maxLat !== undefined &&
            minLng !== undefined && maxLng !== undefined
        ) {
            query = {
                lat: { $gte: parseFloat(minLat), $lte: parseFloat(maxLat) },
                lng: { $gte: parseFloat(minLng), $lte: parseFloat(maxLng) }
            };
            rentals = await Rental.find(query)
                .select(selectFields)
                .limit(Number(limit))
                .sort({ createdAt: -1 });
        } else if (lat && lng && radius) {
            // Fast radius query: bounding box + JS filter
            const userLat = parseFloat(lat);
            const userLng = parseFloat(lng);
            const maxDistance = parseFloat(radius) || 1000;
            // Calculate bounding box in degrees
            const degLat = maxDistance / 111320; // meters per degree latitude
            const degLng = maxDistance / (40075000 * Math.cos(userLat * Math.PI / 180) / 360);
            const minLatBox = userLat - degLat;
            const maxLatBox = userLat + degLat;
            const minLngBox = userLng - degLng;
            const maxLngBox = userLng + degLng;
            query = {
                lat: { $gte: minLatBox, $lte: maxLatBox },
                lng: { $gte: minLngBox, $lte: maxLngBox }
            };
            // Fetch extra for filtering
            let candidates = await Rental.find(query)
                .select(selectFields)
                .limit(Number(limit) * 2)
                .sort({ createdAt: -1 });
            // Haversine filter in JS
            function haversine(lat1, lng1, lat2, lng2) {
                const R = 6371000; // meters
                const dLat = (lat2 - lat1) * Math.PI / 180;
                const dLng = (lng2 - lng1) * Math.PI / 180;
                const a = Math.sin(dLat/2) ** 2 +
                    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                    Math.sin(dLng/2) ** 2;
                return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            }
            rentals = candidates.filter(r =>
                typeof r.lat === 'number' && typeof r.lng === 'number' &&
                haversine(userLat, userLng, r.lat, r.lng) <= maxDistance
            ).slice(0, Number(limit));
        } else {
            // Default: return most recent rentals (limit)
            rentals = await Rental.find({})
                .select(selectFields)
                .limit(Number(limit))
                .sort({ createdAt: -1 });
        }
        // Fetch user phones and merge into rentals
        const ownerIds = rentals.map(r => r.ownerId);
        const users = await User.find({ firebaseUid: { $in: ownerIds } }).select('firebaseUid phone');
        const userPhoneMap = {};
        users.forEach(u => { userPhoneMap[u.firebaseUid] = u.phone; });
        const rentalsWithPhone = rentals.map(r => {
            const rentalObj = r.toObject();
            if (!rentalObj.phone) {
                rentalObj.phone = userPhoneMap[rentalObj.ownerId] || '';
            }
            return rentalObj;
        });
        res.status(200).json(rentalsWithPhone);
    } catch (err) {
        console.error('Error fetching rentals:', err);
        res.status(500).json({ error: 'Failed to fetch rentals', details: err.message });
    }
};

// Get rentals for a specific user
const getUserRentals = async (req, res) => {
    const { email } = req.user; // set by auth middleware
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit); // optionally support a custom limit

    try {
    let query = Rental.find({ email }).sort({ createdAt: -1 });

    // Only apply pagination if `page` and `limit` are provided
    if (!isNaN(page) && !isNaN(limit)) {
        query = query.skip((page - 1) * limit).limit(limit);
    }

    const rentals = await query;
    res.status(200).json(rentals);
    } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user rentals' });
    }
};

// Edit a rental
const editRental = async (req, res) => {
    const { id } = req.params;
    const { title, description, category, price, images, phone, city, street, lat, lng } = req.body;

    try {
    const updated = await Rental.findByIdAndUpdate(
        id,
        { title, description, category, price, images, phone, city, street, lat, lng },
        { new: true }
    );

    if (!updated) return res.status(404).json({ error: 'Rental not found' });

    res.status(200).json(updated);
    } catch (err) {
    res.status(500).json({ error: 'Failed to update rental' });
    }
};

// Delete a rental
const deleteRental = async (req, res) => {
    const { id } = req.params;

    try {
    const deleted = await Rental.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Rental not found' });

    res.status(200).json({ message: 'Rental deleted' });
    } catch (err) {
    res.status(500).json({ error: 'Failed to delete rental' });
    }
};

const searchRentals = async (req, res) => {
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

    const results = await Rental.find({
        title: { $regex: regex },
    });

    res.status(200).json(results);
    } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ message: "Server error during search." });
    }
};

const filterRentals = async (req, res) => {
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

    const rentals = await Rental.find(query);
    res.status(200).json(rentals);
    } catch (err) {
    res.status(500).json({ error: "Failed to filter rentals", details: err.message });
    }
};

module.exports = { 
    uploadNewRental,
    getRentals,
    getUserRentals,
    editRental,
    deleteRental,
    searchRentals,
    filterRentals,
};