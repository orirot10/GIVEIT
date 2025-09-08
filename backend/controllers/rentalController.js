const Rental = require('../models/Rental.js');
const User = require('../models/User');
const { perf_map_v2 } = require('../config/flags');
const redisClient = require('../services/redisClient');

const uploadNewRental = async (req, res) => {
    const {
    title,
    description,
    category,
    subcategory,
    price,
    pricePeriod,
    firstName,
    lastName,
    phone,
    status,
    city,
    street,
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
        subcategory,
        price: parseFloat(price),
        pricePeriod,
        images: imagePaths,
        phone,
        status: status || 'available',
        city,
        street,
        location: lat && lng ? { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] } : undefined,
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
        const { lat, lng, radius, minLat, maxLat, minLng, maxLng, limit = 100 } = req.query;
        const reqId = req.reqId || Math.random().toString(36).slice(2);
        const cacheKey = perf_map_v2 ? `rentals:${JSON.stringify(req.query)}` : null;
        if (perf_map_v2 && redisClient) {
            const cached = await redisClient.get(cacheKey);
            if (cached) {
                res.set('x-cache', 'HIT');
                res.status(200).json(JSON.parse(cached));
                (async () => {
                    try {
                        const fresh = await fetchRentals();
                        await redisClient.set(cacheKey, JSON.stringify(fresh), { EX: 60 });
                    } catch (e) {
                        console.error('cache refresh error', e);
                    }
                })();
                return;
            }
        }

        const dbStart = process.hrtime.bigint();
        const rentalsWithPhone = await fetchRentals();
        const dbTimeMs = Number(process.hrtime.bigint() - dbStart) / 1e6;
        console.log(`[mapDB] reqId=${reqId} dbTimeMs=${dbTimeMs.toFixed(1)} params=${JSON.stringify(req.query)}`);

        if (perf_map_v2 && redisClient) {
            await redisClient.set(cacheKey, JSON.stringify(rentalsWithPhone), { EX: 60 });
            res.set('x-cache', 'MISS');
        }

        res.status(200).json(rentalsWithPhone);

        async function fetchRentals() {
            // perf_map_v2: use server-side geospatial filtering and projection
            if (perf_map_v2 && lat && lng) {
                const userLat = parseFloat(lat);
                const userLng = parseFloat(lng);
                const maxDistance = parseFloat(radius) || 1000;
                const results = await Rental.find({
                    available: true,
                    location: {
                        $nearSphere: {
                            $geometry: { type: 'Point', coordinates: [userLng, userLat] },
                            $maxDistance: maxDistance
                        }
                    }
                })
                    .select('_id title price location images')
                    .limit(Number(limit) || 100)
                    .lean();
                return results.map(r => ({
                    _id: r._id,
                    title: r.title,
                    price: r.price,
                    lat: r.location?.coordinates?.[1],
                    lng: r.location?.coordinates?.[0],
                    thumbnail: r.images?.[0]
                }));
            }

            // Fallback to existing logic
            let query = perf_map_v2 ? { available: true } : { status: 'available' };
            let rentals = [];
            let selectFields = 'firstName lastName email title description category subcategory price pricePeriod images phone status available city street ownerId lat lng rating ratingCount';
            if (
                minLat !== undefined && maxLat !== undefined &&
                minLng !== undefined && maxLng !== undefined
            ) {
                query = {
                    ...(perf_map_v2 ? { available: true } : { status: 'available' }),
                    lat: { $gte: parseFloat(minLat), $lte: parseFloat(maxLat) },
                    lng: { $gte: parseFloat(minLng), $lte: parseFloat(maxLng) }
                };
                rentals = await Rental.find(query)
                    .select(selectFields)
                    .limit(Number(limit))
                    .sort({ createdAt: -1 })
                    .lean();
            } else {
                rentals = await Rental.find(query)
                    .select(selectFields)
                    .limit(Number(limit))
                    .sort({ createdAt: -1 })
                    .lean();
            }
            const ownerIds = rentals.map(r => r.ownerId);
            const users = await User.find({ firebaseUid: { $in: ownerIds } }).select('firebaseUid phone').lean();
            const userPhoneMap = {};
            users.forEach(u => { userPhoneMap[u.firebaseUid] = u.phone; });
            return rentals.map(r => {
                if (!r.phone) {
                    r.phone = userPhoneMap[r.ownerId] || '';
                }
                return r;
            });
        }

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
    const { title, description, category, subcategory, price, images, phone, city, street, lat, lng, status } = req.body;

    try {
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (subcategory !== undefined) updateData.subcategory = subcategory;
    if (price !== undefined) updateData.price = price;
    if (images !== undefined) updateData.images = images;
    if (phone !== undefined) updateData.phone = phone;
    if (city !== undefined) updateData.city = city;
    if (street !== undefined) updateData.street = street;
    if (lat !== undefined) updateData.lat = lat;
    if (lng !== undefined) updateData.lng = lng;
    if (status !== undefined) updateData.status = status;

    const updated = await Rental.findByIdAndUpdate(
        id,
        updateData,
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

const rateRental = async (req, res) => {
    const { id } = req.params;
    const { rating } = req.body;
    try {
        const rental = await Rental.findById(id);
        if (!rental) return res.status(404).json({ error: 'Rental not found' });

        const userId = req.user?.uid;
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });
        if (rental.ratedBy.includes(userId)) {
            return res.status(400).json({ error: 'You have already rated this rental' });
        }
        const value = Math.max(1, Math.min(5, parseFloat(rating)));
        rental.rating = ((rental.rating || 0) * (rental.ratingCount || 0) + value) / ((rental.ratingCount || 0) + 1);
        rental.ratingCount = (rental.ratingCount || 0) + 1;
        rental.ratedBy.push(userId);

        await rental.save();
        res.status(200).json({ rating: rental.rating, ratingCount: rental.ratingCount });
    } catch (err) {
        res.status(500).json({ error: 'Failed to rate rental' });
    }
};

const searchRentals = async (req, res) => {
    try {
        const { query, category, subcategory } = req.query;

        if (!query || query.trim() === "") {
            return res.status(400).json({ message: "Query is required." });
        }

        const words = query.trim().split(/\s+/);
        const regexPattern = words.join(".*");
        const regex = new RegExp(regexPattern, "i");

        const filter = { title: { $regex: regex }, status: 'available' };
        if (category) {
            const categoriesArray = Array.isArray(category) ? category : category.split(',');
            filter.category = { $in: categoriesArray };
        }
        if (subcategory) {
            const subcategoriesArray = Array.isArray(subcategory) ? subcategory : subcategory.split(',');
            filter.subcategory = { $in: subcategoriesArray };
        }

        const results = await Rental.find(filter);
        res.status(200).json(results);
    } catch (err) {
        console.error("Search error:", err);
        res.status(500).json({ message: "Server error during search." });
    }
};

const filterRentals = async (req, res) => {
    try {
    const { category, subcategory, minPrice, maxPrice } = req.query;

    const query = { status: 'available' };
    
    if (category) {
        const categoriesArray = Array.isArray(category)
        ? category
        : category.split(',');
        query.category = { $in: categoriesArray };
    }

    if (subcategory) {
        const subcategoriesArray = Array.isArray(subcategory)
        ? subcategory
        : subcategory.split(',');
        query.subcategory = { $in: subcategoriesArray };
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
    rateRental,
    searchRentals,
    filterRentals,
};