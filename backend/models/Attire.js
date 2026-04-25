const mongoose = require('mongoose');

const attireSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Male', 'Female', 'Unisex'],
  },
  location: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    default: 100,
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=600&auto=format&fit=crop'
  },
  sizes: {
    type: [String],
    default: ['S', 'M', 'L', 'XL'],
  }
}, { timestamps: true });

module.exports = mongoose.model('Attire', attireSchema);
