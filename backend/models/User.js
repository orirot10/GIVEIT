const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firebaseUid: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName:  { type: String, required: true },
    phone:     { type: String },
    email:     { type: String, required: true, unique: true },
    country:   { type: String },
    city:      { type: String },
    street:    { type: String },
    photoURL:  { type: String },
    }, {
    timestamps: true,
});

const User = mongoose.model('User', userSchema);
module.exports = User;