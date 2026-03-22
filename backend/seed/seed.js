require('dotenv').config();

const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Destination = require('../models/Destination');
const Festival = require('../models/Festival');
const EcoSite = require('../models/EcoSite');
const { destinations, festivals, ecoSites } = require('./seedData');

const seedDB = async () => {
  try {
    await connectDB();

    console.log('🗑️  Clearing existing data...');
    await Destination.deleteMany({});
    await Festival.deleteMany({});
    await EcoSite.deleteMany({});

    console.log('🌱 Seeding destinations...');
    await Destination.insertMany(destinations);

    console.log('🌱 Seeding festivals...');
    await Festival.insertMany(festivals);

    console.log('🌱 Seeding eco sites...');
    await EcoSite.insertMany(ecoSites);

    console.log('✅ Database seeded successfully!');
    console.log(`   → ${destinations.length} destinations inserted`);
    console.log(`   → ${festivals.length} festivals inserted`);
    console.log(`   → ${ecoSites.length} eco sites inserted`);
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed.');
    process.exit(0);
  }
};

seedDB();
