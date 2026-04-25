const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  songs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Song',
  }],
  coverImage: {
    type: String,
    default: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?q=80&w=600&auto=format&fit=crop'
  },
  isPublic: {
    type: Boolean,
    default: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('Playlist', playlistSchema);
