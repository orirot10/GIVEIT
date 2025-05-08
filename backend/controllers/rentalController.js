const Rental = require('../models/Rental.js');

const uploadNewRental = async (req, res) => {
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
    return res.status(401).json({ error: 'Unauthorized. User data missing.' });
    }

    try {
    // Get uploaded file paths
    const imagePaths = req.files?.map(file => `/uploads/${file.filename}`) || [];

    const newRental = await Rental.create({
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
        ownerId: req.user.id,
        title,
        description,
        category,
        price,
        pricePeriod,
        images: imagePaths, // ✅ save paths instead of raw strings
        phone,
        status,
        city,
        street
    });

    res.status(201).json(newRental);
    } catch (error) {
    res.status(400).json({ error: error.message });
    }
};

// Get all rentals
const getRentals = async (req, res) => {
    try {
    const rentals = await Rental.find().sort({ createdAt: -1 });
    res.status(200).json(rentals);
    } catch (err) {
    res.status(500).json({ error: 'Failed to fetch rentals' });
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
    const { title, description, category, price, images, phone } = req.body;

    try {
    const updated = await Rental.findByIdAndUpdate(
        id,
        { title, description, category, price, images, phone },
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
    const { category, maxPrice } = req.query;

    const query = {};
    
    if (category) {
        const categoriesArray = Array.isArray(category)
        ? category
        : category.split(',');
        query.category = { $in: categoriesArray };
    }

    if (maxPrice) query.price = { $lte: parseFloat(maxPrice) };

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