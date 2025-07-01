const axios = require('axios');
const cache = {}; // address: { lat, lng }
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

exports.geocodeAddress = async (req, res) => {
  const { address } = req.body;
  if (!address) return res.status(400).json({ error: 'Address required' });

  if (cache[address]) {
    return res.json({ ...cache[address], cached: true });
  }

  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json`,
      { params: { address, key: GOOGLE_API_KEY } }
    );
    const result = response.data.results[0];
    if (!result) return res.status(404).json({ error: 'Not found' });

    const coords = result.geometry.location;
    cache[address] = coords;
    res.json({ ...coords, cached: false });
  } catch (err) {
    res.status(500).json({ error: 'Geocoding failed' });
  }
}; 