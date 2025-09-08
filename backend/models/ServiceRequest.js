const mongoose = require('mongoose');

const serviceRequestSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    ownerId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    category: { type: String, required: true },
    subcategory: { type: String, required: true },
    price: { type: Number, required: true },
    images: [{ type: String }], // URLs or paths
    phone: { type: String, required: true },
    status: { type: String, default: 'pending' },
    type: { 
        type: String, 
        required: true,
        enum: ['offers', 'requests'], 
        default: 'requests' 
    },
    city: { type: String },
    street: { type: String },
    lat: { type: Number },
    lng: { type: Number },
}, { timestamps: true });

const ServiceRequest = mongoose.model('ServiceRequest', serviceRequestSchema);
module.exports = ServiceRequest; 