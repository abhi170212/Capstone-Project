const Itinerary = require('../models/Itinerary');

// POST /api/itineraries
exports.createItinerary = async (req, res) => {
  try {
    const itinerary = await Itinerary.create(req.body);
    res.status(201).json({
      success: true,
      data: itinerary,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create itinerary',
      error: error.message,
    });
  }
};

// GET /api/itineraries
exports.getItineraries = async (req, res) => {
  try {
    const itineraries = await Itinerary.find().populate('days.activities.destinationId');
    res.status(200).json({
      success: true,
      count: itineraries.length,
      data: itineraries,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// GET /api/itineraries/:id
exports.getItineraryById = async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id).populate('days.activities.destinationId');
    if (!itinerary) {
      return res.status(404).json({
        success: false,
        message: 'Itinerary not found',
      });
    }
    res.status(200).json({
      success: true,
      data: itinerary,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};
