const mongoose = require('mongoose');

const personalitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    era: {
      type: String,
      required: true,
      enum: ['Ancient Era', 'Medieval & Pre-Independence', 'Post-Independence', 'Modern Day'],
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Personality', personalitySchema);
