const mongoose = require('mongoose');

const rentalRequestSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    category: { type: String, required: true },
    subcategory: { type: String },
    price: { type: Number, required: true },
    pricePeriod: { type: String, default: 'use' },
    images: [{ type: String }], // URLs or paths
    phone: { type: String, required: true },
    status: { type: String, default: 'available' },
    city: { type: String },
    street: { type: String },
    lat: { type: Number },
    lng: { type: Number },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

// Note: Ensure the collection name matches your MongoDB collection for requests
// If your collection is named 'rental_requests', Mongoose will automatically look for that
// based on the model name 'RentalRequest'.
const RentalRequest = mongoose.model('RentalRequest', rentalRequestSchema); 
module.exports = RentalRequest; 