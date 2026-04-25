const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'coadmin', 'guest'],
    default: 'user',
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Destination'
  }],
  createdTrips: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Itinerary'
  }],
  savedRoutes: [{
    destinationName: String,
    mode: String,
    distance: String,
    duration: String,
    dateSaved: { type: Date, default: Date.now }
  }],
  likedSongs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Song'
  }],
  playlists: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Playlist'
  }],
  isBanned: {
    type: Boolean,
    default: false,
  },
  avatar: {
    type: String,
    default: "",
  },
  bio: {
    type: String,
    default: "Explorer of Bihar",
    maxLength: 160
  },
  coverImage: {
    type: String,
    default: "",
  }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
