const mongoose = require('mongoose');

const festivalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Festival name is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
    },
    month: {
      type: String,
      required: [true, 'Month is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    images: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      default: 'General',
    },
    highlight: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Festival', festivalSchema);
