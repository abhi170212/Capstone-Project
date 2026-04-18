require('dotenv').config();
const mongoose = require('mongoose');
const Destination = require('./models/Destination');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bihartourism';

// Adjusted matching names based on the DB content
const imageMap = {
  "Bodh Gaya": "/destinations/bodh_gaya.png",
  "Nalanda University Ruins": "/destinations/nalanda.png",
  "Rajgir": "/destinations/rajgir.png",
  "Golghar": "/destinations/patna.png",
  "Patna Sahib (Takht Sri Harmandir Sahib)": "/destinations/patna.png",
  "Vaishali": "/destinations/gaya.png", // reusing gaya since we have it, or leave it
};

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('MongoDB connected. Updating destinations with Gemini images...');
    const destinations = await Destination.find({});
    
    let updateCount = 0;
    for (let dest of destinations) {
      if (imageMap[dest.name]) {
        dest.images = [imageMap[dest.name]];
        await dest.save();
        console.log(`Attached Gemini image to: ${dest.name}`);
        updateCount++;
      }
    }
    
    console.log(`Complete! Successfully updated ${updateCount} destinations with generated images.`);
    process.exit(0);
  })
  .catch(err => {
    console.error('Error during update:', err);
    process.exit(1);
  });
