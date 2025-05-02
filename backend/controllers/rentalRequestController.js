const RentalRequest = require('../models/RentalRequest');

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
    // Add 'type' filter to ensure we only get requests if needed, though model default helps
    filter.type = 'requests';
    return filter;
};

// Controller function to get all rental requests (or based on type if needed later)
const getRentalRequests = async (req, res) => {
    try {
        // For now, fetch all requests. Can add filtering by type if needed.
        const requests = await RentalRequest.find({ type: 'requests' }).sort({ createdAt: -1 });
        console.log(`Fetched ${requests.length} rental requests`);
        res.status(200).json(requests.length ? requests : []);
    } catch (err) {
        console.error('Error fetching rental requests:', err);
        res.status(500).json({ error: 'Failed to fetch rental requests', details: err.message });
    }
};


// Controller function for searching rental requests
const searchRentalRequests = async (req, res) => {
    const { query } = req.query;
    if (!query) {
        return res.status(400).json({ error: 'Search query is required' });
    }

    try {
        const searchQuery = buildSearchQuery(query);
        const results = await RentalRequest.find(searchQuery).sort({ createdAt: -1 });
        console.log(`Found ${results.length} rental requests matching query: "${query}"`);
        res.status(200).json(results.length ? results : []);
    } catch (err) {
        console.error('Error searching rental requests:', err);
        res.status(500).json({ error: 'Failed to search rental requests', details: err.message });
    }
};

// Controller function for filtering rental requests
const filterRentalRequests = async (req, res) => {
    try {
        const filterQuery = buildFilterQuery(req.query);
        const results = await RentalRequest.find(filterQuery).sort({ createdAt: -1 });
        console.log(`Found ${results.length} rental requests matching filter:`, req.query);
        res.status(200).json(results.length ? results : []);
    } catch (err) {
        console.error('Error filtering rental requests:', err);
        res.status(500).json({ error: 'Failed to filter rental requests', details: err.message });
    }
};

module.exports = {
    getRentalRequests,
    searchRentalRequests,
    filterRentalRequests,
}; 