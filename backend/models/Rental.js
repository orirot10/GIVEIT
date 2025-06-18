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
    images: [{ type: String }], // URLs or paths
    phone: { type: String, required: true },
    status: { type: String, default: 'available' },
    city: { type: String },
    street: { type: String },
    ownerId: { type: String, required: true },
}, { timestamps: true });

const Rental = mongoose.model('Rental', rentalSchema);
module.exports = Rental;