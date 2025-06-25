const mongoose = require('mongoose');
const axios = require('axios');
const Service = require('./models/Service');
const Rental = require('./models/Rental');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/giveit';
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || '<YOUR_GOOGLE_MAPS_API_KEY>';

async function geocode(street, city) {
  if (!street || !city) return null;
  const address = encodeURIComponent(`${street}, ${city}`);
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${GOOGLE_MAPS_API_KEY}`;
  try {
    const res = await axios.get(url);
    if (res.data.status === 'OK') {
      const loc = res.data.results[0].geometry.location;
      return { lat: loc.lat, lng: loc.lng };
    }
    return null;
  } catch (e) {
    console.error('Geocode error:', e.message);
    return null;
  }
}

async function updateCollection(Model, name) {
  const docs = await Model.find({ $or: [{ lat: { $exists: false } }, { lng: { $exists: false } }, { lat: null }, { lng: null }] });
  let updated = 0;
  for (const doc of docs) {
    const coords = await geocode(doc.street, doc.city);
    if (coords) {
      doc.lat = coords.lat;
      doc.lng = coords.lng;
      await doc.save();
      updated++;
      console.log(`[${name}] Updated ${doc._id} with lat/lng:`, coords);
    }
  }
  console.log(`[${name}] Updated ${updated} documents.`);
}

async function main() {
  await mongoose.connect(MONGO_URI);
  await updateCollection(Service, 'Service');
  await updateCollection(Rental, 'Rental');
  await mongoose.disconnect();
}

main(); 