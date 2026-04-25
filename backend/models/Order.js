const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [
    {
      attire: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Attire',
        required: true,
      },
      name: String,
      size: String,
      quantity: Number,
      price: Number,
      image: String,
    }
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  shippingAddress: {
    address: String,
    city: String,
    postalCode: String,
    country: String,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  paymentStatus: {
    type: String,
    default: 'Pending',
    enum: ['Pending', 'Completed', 'Failed']
  },
  orderStatus: {
    type: String,
    default: 'Processing',
    enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled']
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
