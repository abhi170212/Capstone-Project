require('dotenv').config();
const mongoose = require('mongoose');
const Destination = require('./models/Destination');

const fallbackImages = {
  "Vikramshila Ruins": "https://images.unsplash.com/photo-1590408544923-1d0bc8382d56?w=800&q=80",
  "Valmiki National Park": "https://images.unsplash.com/photo-1588661642232-a42e5ee65fce?w=800&q=80",
  "Kesaria Stupa": "https://images.unsplash.com/photo-1582650742194-e354a938c353?w=800&q=80",
  "Barabar Caves": "https://images.unsplash.com/photo-1627885065099-281b373fb787?w=800&q=80",
  "Kakolat Waterfall": "https://images.unsplash.com/photo-1546514355-7fdc90ccbc0a?w=800&q=80",
  "Rohtasgarh Fort": "https://images.unsplash.com/photo-1605335195420-5c6218da3a14?w=800&q=80",
  "Bhimbandh Wildlife Sanctuary": "https://images.unsplash.com/photo-1583344195155-2252c7be2199?w=800&q=80",
  "Sanjay Gandhi Biological Park": "https://images.unsplash.com/photo-1498453443187-5c5cb2cbdbf0?w=800&q=80",
  "Maner Sharif": "https://images.unsplash.com/photo-1598463953507-0209c1fa41fe?w=800&q=80"
};

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('MongoDB Hooked. Applying high-quality fallback images to remaining destinations...');
    const destinations = await Destination.find({});
    
    let updateCount = 0;
    for (let dest of destinations) {
      if ((!dest.images || dest.images.length === 0) && fallbackImages[dest.name]) {
        // Use native updateOne to bypass mongoose document validation for older invalid fields like the 'interests' array
        await Destination.collection.updateOne(
          { _id: dest._id },
          { $set: { images: [fallbackImages[dest.name]] } }
        );
        console.log(`Fixed missing image for: ${dest.name}`);
        updateCount++;
      }
    }
    
    console.log(`Complete! Successfully fixed ${updateCount} destinations.`);
    process.exit(0);
  })
  .catch(err => {
    console.error('Error during data seeding:', err);
    process.exit(1);
  });
