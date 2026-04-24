const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  artist: {
    type: String,
    required: true,
  },
  audioUrl: {
    type: String,
    required: true,
  },
  coverImage: {
    type: String,
    default: 'https://images.unsplash.com/photo-1493225457124-a1a2a5f5f9af?q=80&w=600&auto=format&fit=crop'
  }
}, { timestamps: true });

module.exports = mongoose.model('Song', songSchema);
