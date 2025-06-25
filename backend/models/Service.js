const mongoose = require('mongoose');


const serviceSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    ownerId: { type: String, required: true },
    firebaseUid: { type: String },
    title: { type: String, required: true },
    description: { type: String },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    pricePeriod: { type: String, default: 'use' },
    images: [{ type: String }],
    phone: { type: String },
    status: { type: String, default: 'available' },
    city: { type: String },
    street: { type: String },
    lat: { type: Number },
    lng: { type: Number },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Service', serviceSchema);