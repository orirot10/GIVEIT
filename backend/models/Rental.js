const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    pricePeriod: { type: String, default: 'use' },
    images: [{ type: String }], // Firebase Storage URLs or local paths
    phone: { type: String },
    status: { type: String, default: 'available' },
    city: { type: String },
    street: { type: String },
    location: { type: String },
    lat: { type: Number },
    lng: { type: Number },
    ownerId: { type: String, required: true },
    firebaseUid: { type: String, required: true },
}, { timestamps: true });

// Add compound index for spatial queries
rentalSchema.index({ lat: 1, lng: 1 });
// Add index for category filtering
rentalSchema.index({ category: 1 });
// Add index for sorting by creation date
rentalSchema.index({ createdAt: -1 });

const Rental = mongoose.model('Rental', rentalSchema);
module.exports = Rental;