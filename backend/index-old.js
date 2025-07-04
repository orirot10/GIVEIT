const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Property = require('./models/Property');
const Rental = require('./models/Rental');
const Service = require('./models/Service');

const app = express();
const PORT = 5173;

app.use(express.json());
app.use(cors({ origin: 'https://gleeful-mooncake-c16405.netlify.app' }));

mongoose.connect('mongodb+srv://orirot13:rpFGh4edVlRNO1i4@cluster0.wcya9ix.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('מחובר ל-MongoDB Atlas'))
  .catch((err) => console.error('שגיאה בחיבור ל-MongoDB:', err));

// Properties endpoint
app.get('/api/properties', async (req, res) => {
  try {
    const properties = await Property.find();
    res.json(properties);
  } catch (err) {
    res.status(500).json({ error: 'שגיאה בטעינת הנכסים' });
  }
});

// Rentals endpoint
app.get('/api/rentals', async (req, res) => {
  try {
    const rentals = await Rental.find();
    res.json(rentals);
  } catch (err) {
    res.status(500).json({ error: 'שגיאה בטעינת מוצרים' });
  }
});

// Services endpoint
app.get('/api/services', async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: 'שגיאה בטעינת השירותים' });
  }
});

app.listen(PORT, () => {
  console.log(`השרת רץ על פורט ${PORT}`);
});