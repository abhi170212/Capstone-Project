const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true }
}, { _id: false });

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Food name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  location: {
    type: String,
    required: [true, 'Location/Destination is required']
  },
  ingredients: {
    type: [String],
    default: []
  },
  recipe: {
    type: String,
    required: [true, 'Recipe details are required']
  },
  famousShops: {
    type: [shopSchema],
    default: []
  },
  image: {
    type: String,
    required: [true, 'Image URL is required']
  }
}, { timestamps: true });

module.exports = mongoose.model('Food', foodSchema);
