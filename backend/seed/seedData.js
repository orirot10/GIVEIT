const Rental = require('../models/Rental');

const seedData = async () => {
    try {
        await Rental.deleteMany({});
        await Rental.insertMany([
        { title: 'מברגה חשמלית', lat: 32.0853, lng: 34.7818, category: 'home_items', subcategory: 'small_tools', rating: 4 },
        { title: 'מחשב נייד', lat: 32.0800, lng: 34.7900, category: 'study_equipment', subcategory: 'laptop', rating: 5 },
        { title: 'דירה בתל אביב', lat: 32.0700, lng: 34.7800, category: 'home_items', subcategory: 'small_tools', rating: 3 },
        { title: 'מכסחת דשא', lat: 32.03296555682, lng: 34.74801, category: 'home_items', subcategory: 'small_tools', rating: 2 }
        ]);
        console.log('Sample data seeded successfully');
    } catch (err) {
        console.error('Error seeding data:', err);
    }
};

module.exports = seedData;