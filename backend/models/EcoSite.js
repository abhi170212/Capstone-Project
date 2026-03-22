const mongoose = require('mongoose');

const ecoSiteSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Eco site name is required'],
      trim: true,
    },
    wildlife: {
      type: [String],
      default: [],
    },
    ecoActivities: {
      type: [String],
      default: [],
    },
    parkType: {
      type: String,
      required: [true, 'Park type is required'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
    },
    images: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('EcoSite', ecoSiteSchema);
