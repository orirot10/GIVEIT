const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName:  { type: String, required: true },
    phone:     { type: String, required: true },
    email:     { type: String, required: true, unique: true },
    country:   { type: String, required: true },
    password:  { type: String, required: true },
    city:      { type: String },
    street:    { type: String },
    }, {
    timestamps: true,
});

const User = mongoose.model('User', userSchema);
module.exports = User;