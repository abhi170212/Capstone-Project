const mongoose = require('mongoose');

const coordinatesSchema = new mongoose.Schema({
  lat: { type: Number },
  lng: { type: Number },
}, { _id: false });

const destinationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Destination name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
    },
    type: {
      type: String,
      enum: ['eco', 'cultural', 'historical'],
      required: [true, 'Type is required'],
    },
    images: {
      type: [String],
      default: [],
    },
    coordinates: {
      type: coordinatesSchema,
      default: {},
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    ecoScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    interests: {
      type: [String],
      enum: ['Wildlife', 'History', 'Nature', 'Festivals', 'Architecture', 'Spiritual'],
      default: [],
    },
    budget: {
      type: String,
      enum: ['Budget', 'Mid-range', 'Luxury'],
      default: 'Mid-range',
    },
    activities: {
      type: [String],
      default: [],
    },
    bestSeason: {
      type: String,
      default: '',
    },
    entryFee: {
      type: String,
      default: 'Free',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Destination', destinationSchema);
