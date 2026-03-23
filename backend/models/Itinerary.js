const mongoose = require('mongoose');

const itinerarySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Itinerary name is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    days: [
      {
        day: { type: Number, required: true },
        activities: [
          {
            time: { type: String },
            location: { type: String },
            description: { type: String },
            destinationId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'Destination',
            },
          },
        ],
      },
    ],
    totalBudget: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Itinerary', itinerarySchema);
