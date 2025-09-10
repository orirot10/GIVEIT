const Service = require('../models/Service.js');
const { perf_map_v2 } = require('../config/flags');
const redisClient = require('../services/redisClient');

const uploadNewService = async (req, res) => {
    const { title, description, category, subcategory, price, pricePeriod, phone, city, street, images, lat, lng, status } = req.body;

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

        const newService = await Service.create({
            firstName: req.user.mongoUser?.firstName || req.user.firstName,
            lastName: req.user.mongoUser?.lastName || req.user.lastName,
            email: req.user.email,
            ownerId: req.user.uid || req.user.id,
            firebaseUid: req.user.uid,
            title,
            description,
            category,
            subcategory: subcategory || undefined,
            price: parseFloat(price),
            pricePeriod,
            phone,
            city,
            street,
            images: imagePaths,
            location: lat && lng ? { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] } : undefined,
            lat: lat ? parseFloat(lat) : undefined,
            lng: lng ? parseFloat(lng) : undefined,
            status: status || 'available'
        });

        res.status(201).json(newService);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getServices = async (req, res) => {
    try {
        const { lat, lng, radius, minLat, maxLat, minLng, maxLng, limit = 100 } = req.query;
        const reqId = req.reqId || Math.random().toString(36).slice(2);
        const cacheKey = perf_map_v2 ? `services:${JSON.stringify(req.query)}` : null;
        if (perf_map_v2 && redisClient) {
            const cached = await redisClient.get(cacheKey);
            if (cached) {
                res.set('x-cache', 'HIT');
                res.status(200).json(JSON.parse(cached));
                (async () => {
                    try {
                        const fresh = await fetchServices();
                        await redisClient.set(cacheKey, JSON.stringify(fresh), { EX: 60 });
                    } catch (e) {
                        console.error('cache refresh error', e);
                    }
                })();
                return;
            }
        }

        const dbStart = process.hrtime.bigint();
        const services = await fetchServices();
        const dbTimeMs = Number(process.hrtime.bigint() - dbStart) / 1e6;
        console.log(`[mapDB] reqId=${reqId} dbTimeMs=${dbTimeMs.toFixed(1)} params=${JSON.stringify(req.query)}`);

        if (perf_map_v2 && redisClient) {
            await redisClient.set(cacheKey, JSON.stringify(services), { EX: 60 });
            res.set('x-cache', 'MISS');
        }

        res.status(200).json(services);

        async function fetchServices() {
            if (perf_map_v2 && lat && lng) {
                const userLat = parseFloat(lat);
                const userLng = parseFloat(lng);
                const maxDistance = parseFloat(radius) || 1000;
                const results = await Service.find({
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

            let query = perf_map_v2 ? { available: true } : { status: 'available' };
            let services = [];
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
                services = await Service.find(query)
                    .select(selectFields)
                    .limit(Number(limit))
                    .sort({ createdAt: -1 })
                    .lean();
            } else {
                services = await Service.find(query)
                    .select(selectFields)
                    .limit(Number(limit))
                    .sort({ createdAt: -1 })
                    .lean();
            }
            return services;
        }

    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch services' });
    }
};

const getUserServices = async (req, res) => {
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
        res.status(500).json({ error: 'Failed to fetch user services' });
    }
};

const editService = async (req, res) => {
    const { id } = req.params;
    const { title, description, category, subcategory, price, phone, city, street, lat, lng, status } = req.body;

    try {
        const updateData = {};
        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (category !== undefined) updateData.category = category;
        if (subcategory !== undefined) updateData.subcategory = subcategory;
        if (price !== undefined) updateData.price = price;
        if (phone !== undefined) updateData.phone = phone;
        if (city !== undefined) updateData.city = city;
        if (street !== undefined) updateData.street = street;
        if (lat !== undefined) updateData.lat = lat;
        if (lng !== undefined) updateData.lng = lng;
        if (status !== undefined) updateData.status = status;

        const updated = await Service.findByIdAndUpdate(
            id,
            updateData,
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

const rateService = async (req, res) => {
    const { id } = req.params;
    const { rating } = req.body;
    try {
        const service = await Service.findById(id);
        if (!service) return res.status(404).json({ error: 'Service not found' });

        const userId = req.user?.uid;
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });
        if (service.ratedBy.includes(userId)) {
            return res.status(400).json({ error: 'You have already rated this service' });
        }
        const value = Math.max(1, Math.min(5, parseFloat(rating)));
        service.rating = ((service.rating || 0) * (service.ratingCount || 0) + value) / ((service.ratingCount || 0) + 1);
        service.ratingCount = (service.ratingCount || 0) + 1;
        service.ratedBy.push(userId);

        await service.save();
        res.status(200).json({ rating: service.rating, ratingCount: service.ratingCount });
    } catch (err) {
        res.status(500).json({ error: 'Failed to rate service' });
    }
};

const searchServices = async (req, res) => {
    try {
        const { query, category, subcategory } = req.query;

        if (!query) {
            return res.status(400).json({ message: "Query parameter is required" });
        }

        const regex = new RegExp(query, "i");
        const filter = { title: { $regex: regex }, status: 'available' };
        if (category) {
            const categoriesArray = Array.isArray(category) ? category : category.split(',');
            filter.category = { $in: categoriesArray };
        }
        if (subcategory) {
            const subcategoriesArray = Array.isArray(subcategory) ? subcategory : subcategory.split(',');
            filter.subcategory = { $in: subcategoriesArray };
        }

        const services = await Service.find(filter);

        res.json(services);
    } catch (err) {
        console.error("Search services error:", err);
        res.status(500).json({ message: "Server error during service search" });
    }
};

const filterServices = async (req, res) => {
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

    const services = await Service.find(query).select('firstName lastName email title description category subcategory price pricePeriod images phone status city street ownerId lat lng rating ratingCount');
    res.status(200).json(services);
    } catch (err) {
    res.status(500).json({ error: "Failed to filter services", details: err.message });
    }
};

module.exports = { 
    uploadNewService,
    getServices,
    getUserServices,
    editService,
    deleteService,
    rateService,
    searchServices,
    filterServices,
};