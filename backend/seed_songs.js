const mongoose = require('mongoose');
require('dotenv').config({ path: __dirname + '/../.env' });
const Song = require('./models/Song');

const initialSongs = [
  {
    title: "Chhath Pooja Song (Kelwa Ke Paat Par)",
    artist: "Sharda Sinha",
    youtubeUrl: "https://www.youtube.com/watch?v=FjIXXyY0uK4",
    coverImage: "https://images.unsplash.com/photo-1605553149547-cdcfdfc1cb56?q=80&w=600&auto=format&fit=crop"
  },
  {
    title: "Jiya Ho Bihar Ke Lala",
    artist: "Manoj Tiwari",
    youtubeUrl: "https://www.youtube.com/watch?v=mD0iX2iQc-c",
    coverImage: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=600&auto=format&fit=crop"
  },
  {
    title: "Sohar - Bhojpuri Folk",
    artist: "Sharda Sinha",
    youtubeUrl: "https://www.youtube.com/watch?v=Xh3hM2jZ_d0",
    coverImage: "https://images.unsplash.com/photo-1518105779148-18e47262174c?q=80&w=600&auto=format&fit=crop"
  },
  {
    title: "Purbi Folk Song",
    artist: "Maithili Thakur",
    youtubeUrl: "https://www.youtube.com/watch?v=2L1qD2K6kQE",
    coverImage: "https://images.unsplash.com/photo-1516280440502-45e0d19a27db?q=80&w=600&auto=format&fit=crop"
  }
];

const seedSongs = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to DB');
    
    // Check if songs exist
    const count = await Song.countDocuments();
    if (count === 0) {
      await Song.insertMany(initialSongs);
      console.log('Successfully seeded initial songs!');
    } else {
      console.log('Songs already exist. Skipping seed.');
    }
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedSongs();
