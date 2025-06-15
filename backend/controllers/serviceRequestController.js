const ServiceRequest = require('../models/ServiceRequest');

// Helper function to build search query
const buildSearchQuery = (query) => {
    const searchRegex = { $regex: query, $options: 'i' }; // Case-insensitive search
    return {
        $or: [
            { title: searchRegex },
            { description: searchRegex },
            { city: searchRegex },
        ],
    };
};

// Helper function to build filter query
const buildFilterQuery = (params) => {
    const filter = {};
    if (params.category) {
        // Handle comma-separated categories
        const categories = params.category.split(',').map(cat => cat.trim());
        if (categories.length > 0) {
            filter.category = { $in: categories };
        }
    }
    if (params.maxPrice) {
        const price = parseFloat(params.maxPrice);
        if (!isNaN(price)) {
            filter.price = { $lte: price }; // Less than or equal to maxPrice
        }
    }
    filter.type = 'requests';
    return filter;
};

// Controller function to get all service requests
const getServiceRequests = async (req, res) => {
    try {
        const requests = await ServiceRequest.find({ type: 'requests' }).sort({ createdAt: -1 });
        console.log(`Fetched ${requests.length} service requests`);
        res.status(200).json(requests.length ? requests : []);
    } catch (err) {
        console.error('Error fetching service requests:', err);
        res.status(500).json({ error: 'Failed to fetch service requests', details: err.message });
    }
};

// Controller function for searching service requests
const searchServiceRequests = async (req, res) => {
    const { query } = req.query;
    if (!query) {
        return res.status(400).json({ error: 'Search query is required' });
    }

    try {
        const searchQuery = buildSearchQuery(query);
        const results = await ServiceRequest.find(searchQuery).sort({ createdAt: -1 });
        console.log(`Found ${results.length} service requests matching query: "${query}"`);
        res.status(200).json(results.length ? results : []);
    } catch (err) {
        console.error('Error searching service requests:', err);
        res.status(500).json({ error: 'Failed to search service requests', details: err.message });
    }
};

// Controller function for filtering service requests
const filterServiceRequests = async (req, res) => {
    try {
        const filterQuery = buildFilterQuery(req.query);
        const results = await ServiceRequest.find(filterQuery).sort({ createdAt: -1 });
        console.log(`Found ${results.length} service requests matching filter:`, req.query);
        res.status(200).json(results.length ? results : []);
    } catch (err) {
        console.error('Error filtering service requests:', err);
        res.status(500).json({ error: 'Failed to filter service requests', details: err.message });
    }
};

module.exports = {
    getServiceRequests,
    searchServiceRequests,
    filterServiceRequests,
}; 