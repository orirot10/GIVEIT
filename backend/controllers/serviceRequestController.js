const Service = require('../models/ServiceRequest.js');

const uploadNewServiceRequest = async (req, res) => {
    console.log('Received service request:', req.body);
    console.log('Files:', req.files);
    console.log('User:', req.user);

    const {
        title,
        description,
        category,
        price,
        phone,
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

        const newServiceRequest = await Service.create({
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            email: req.user.email,
            ownerId: req.user.id,
            title,
            description,
            category,
            price,
            images: imagePaths,
            phone,
            city,
            street,
            type: 'requests' // Explicitly set type as requests
        });

        console.log('Created service request:', newServiceRequest);
        res.status(201).json(newServiceRequest);
    } catch (error) {
        console.error('Error creating service request:', error);
        res.status(400).json({ error: error.message });
    }
};

const getServiceRequests = async (req, res) => {
    try {
        const services = await Service.find().sort({ createdAt: -1 });
        res.status(200).json(services);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch service requests' });
    }
};

const getUserServiceRequests = async (req, res) => {
    const { email } = req.user;
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    try {
        let query = Service.find({ email }).sort({ createdAt: -1 });

        if (!isNaN(page) && !isNaN(limit)) {
            query = query.skip((page - 1) * limit).limit(limit);
        }

        const services = await query;
        res.status(200).json(services);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch user service requests' });
    }
};

const editService = async (req, res) => {
    const { id } = req.params;
    const { title, description, category, price, phone } = req.body;

    try {
        const updated = await Service.findByIdAndUpdate(
            id,
            { title, description, category, price, phone },
            { new: true }
        );

        if (!updated) return res.status(404).json({ error: 'Service not found' });

        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update service' });
    }
};

const deleteService = async (req, res) => {
    const { id } = req.params;

    try {
        const deleted = await Service.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ error: 'Service not found' });

        res.status(200).json({ message: 'Service deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete service' });
    }
};

const searchServiceRequests = async (req, res) => {
    try {
        const query = req.query.query;

        if (!query) {
            return res.status(400).json({ message: "Query parameter is required" });
        }

        // Use a case-insensitive and diacritic-insensitive regex for partial match (works for Hebrew/English)
        const regex = new RegExp(query, "i");

        const services = await Service.find({ title: { $regex: regex } });

        res.json(services);
    } catch (err) {
        console.error("Search service requests error:", err);
        res.status(500).json({ message: "Server error during service request search" });
    }
};

const filterServiceRequests = async (req, res) => {
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

        const services = await Service.find(query);
        res.status(200).json(services);
    } catch (err) {
        res.status(500).json({ error: "Failed to filter service requests", details: err.message });
    }
};

module.exports = {
    uploadNewServiceRequest,
    getServiceRequests,
    getUserServiceRequests,
    editService,
    deleteService,
    searchServiceRequests,
    filterServiceRequests
};