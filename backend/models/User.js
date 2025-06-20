const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firebaseUid: { type: String, required: true, unique: true },
    firstName: { type: String },
    lastName:  { type: String },
    phone:     { type: String },
    email:     { type: String, required: true, unique: true },
    country:   { type: String },
    city:      { type: String },
    street:    { type: String },
    photoURL:  { type: String },
    displayName: { type: String },
    photoUrl: { type: String },
    createdAt: { type: Date, default: Date.now },
}, {
    timestamps: true,
});

const User = mongoose.model('User', userSchema);
module.exports = User;