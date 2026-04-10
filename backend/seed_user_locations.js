require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');
const Destination = require('./models/Destination');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bihartourism';

const data = [
  {
    name: "Bodh Gaya",
    description: "A UNESCO World Heritage site and the most significant Buddhist pilgrimage site, featuring the Mahabodhi Temple and the Bodhi Tree.",
    location: "Gaya District",
    category: "Temples",
    type: "cultural",
    coordinates: { lat: 24.6959, lng: 84.9961 },
    rating: 4.9,
    bestSeason: "October to March",
    entryFee: "Free",
    images: ["https://images.unsplash.com/photo-1596414272183-5ee9acabf333?w=800&q=80"]
  },
  {
    name: "Nalanda",
    description: "Renowned for the ruins of the ancient Nalanda Mahavihara, a world-renowned ancient university.",
    location: "Nalanda District",
    category: "Historical",
    type: "historical",
    coordinates: { lat: 25.1356, lng: 85.4461 },
    rating: 4.8,
    bestSeason: "October to March",
    entryFee: "INR 20",
    images: ["https://images.unsplash.com/photo-1627885065099-281b373fb787?w=800&q=80"]
  },
  {
    name: "Rajgir",
    description: "Surrounded by hills, it is sacred to Hindus, Buddhists, and Jains, featuring the Vishwa Shanti Stupa, Venu Vana, and the Pandu Pokhar lake.",
    location: "Nalanda District",
    category: "Nature",
    type: "eco",
    coordinates: { lat: 25.0163, lng: 85.4190 },
    rating: 4.7,
    bestSeason: "October to March",
    entryFee: "Varies by site",
    images: ["https://images.unsplash.com/photo-1582650742194-e354a938c353?w=800&q=80"]
  },
  {
    name: "Gaya",
    description: "A sacred city on the banks of the Falgu River, famous for the Vishnupad Temple and Pind Daan rituals.",
    location: "Gaya District",
    category: "Temples",
    type: "cultural",
    coordinates: { lat: 24.7955, lng: 85.0002 },
    rating: 4.5,
    bestSeason: "Pitrapaksha (September)",
    entryFee: "Free",
    images: ["https://images.unsplash.com/photo-1632733979402-1b1511bd9fa6?w=800&q=80"]
  },
  {
    name: "Patna (Patliputra)",
    description: "The capital city with historical sites like Golghar, Patna Museum, and Bihar Museum.",
    location: "Patna",
    category: "Historical",
    type: "historical",
    coordinates: { lat: 25.5941, lng: 85.1376 },
    rating: 4.5,
    bestSeason: "October to March",
    entryFee: "Varies",
    images: ["https://images.unsplash.com/photo-1605335195420-5c6218da3a14?w=800&q=80"]
  },
  {
    name: "Vaishali",
    description: "Known for the Ashokan Pillar and as the place where Lord Mahavira was born.",
    location: "Vaishali District",
    category: "Historical",
    type: "historical",
    coordinates: { lat: 25.9904, lng: 85.1278 },
    rating: 4.6,
    bestSeason: "October to March",
    entryFee: "Free",
    images: ["https://images.unsplash.com/photo-1598463953507-0209c1fa41fe?w=800&q=80"]
  },
  {
    name: "Pawapuri",
    description: "The place where Lord Mahavira attained Nirvana, known for the stunning Jalmandir.",
    location: "Nalanda District",
    category: "Temples",
    type: "cultural",
    coordinates: { lat: 25.2630, lng: 85.5414 },
    rating: 4.8,
    bestSeason: "Diwali (October/November)",
    entryFee: "Free",
    images: ["https://images.unsplash.com/photo-1590050752117-640a23e1de86?w=800&q=80"]
  },
  {
    name: "Valmiki Tiger Reserve",
    description: "Located in West Champaran, it is the only national park in Bihar.",
    location: "West Champaran",
    category: "Nature",
    type: "eco",
    coordinates: { lat: 27.4332, lng: 84.0531 },
    rating: 4.7,
    bestSeason: "November to March",
    entryFee: "INR 150",
    images: ["https://images.unsplash.com/photo-1588661642232-a42e5ee65fce?w=800&q=80"]
  },
  {
    name: "Mundeshwari Devi Temple",
    description: "Considered one of the oldest functional temples in India.",
    location: "Kaimur District",
    category: "Temples",
    type: "cultural",
    coordinates: { lat: 25.0416, lng: 83.5658 },
    rating: 4.6,
    bestSeason: "Navratri",
    entryFee: "Free",
    images: ["https://images.unsplash.com/photo-1627885065099-281b373fb787?w=800&q=80"]
  },
  {
    name: "Sasaram",
    description: "Famous for the magnificent tomb of Sher Shah Suri.",
    location: "Rohtas District",
    category: "Historical",
    type: "historical",
    coordinates: { lat: 24.9490, lng: 84.0314 },
    rating: 4.7,
    bestSeason: "October to March",
    entryFee: "INR 25",
    images: ["https://images.unsplash.com/photo-1605335195420-5c6218da3a14?w=800&q=80"]
  },
  {
    name: "Maner Sharif",
    description: "A significant Sufi center housing the tomb of Sufi saint Hazrat Makhdoom Shah Yahya Maneri.",
    location: "Patna District",
    category: "Festivals",
    type: "cultural",
    coordinates: { lat: 25.6483, lng: 84.8821 },
    rating: 4.5,
    bestSeason: "Urs Festival",
    entryFee: "Free",
    images: ["https://images.unsplash.com/photo-1598463953507-0209c1fa41fe?w=800&q=80"]
  }
];

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('MongoDB Hooked. Purging old destinations...');
    await Destination.deleteMany({});
    
    console.log('Seeding 11 Custom Locations...');
    await Destination.insertMany(data);
    
    console.log('Complete! Map points updated.');
    process.exit(0);
  })
  .catch(err => {
    console.error('Error during data seeding:', err);
    process.exit(1);
  });
