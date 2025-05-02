const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: String,
  location: String,
  price: Number,
  lat: Number,
  lng: Number,
});

module.exports = mongoose.model('Property', propertySchema);