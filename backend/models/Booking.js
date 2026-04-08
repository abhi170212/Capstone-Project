const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  bookingType: {
    type: String,
    enum: ['hotel', 'tour', 'package'],
    required: true,
  },
  destinationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Destination',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: String,
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  guests: {
    type: Number,
    required: true,
    min: 1,
  },
  pricePerPerson: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending',
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending',
  },
  paymentMethod: String,
  transactionId: String,
  contactInfo: {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
  },
  specialRequests: String,
  cancellationPolicy: String,
}, {
  timestamps: true,
});

// Pre-save hook to calculate total price
bookingSchema.pre('save', function(next) {
  if (this.guests && this.pricePerPerson) {
    this.totalPrice = this.guests * this.pricePerPerson;
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
