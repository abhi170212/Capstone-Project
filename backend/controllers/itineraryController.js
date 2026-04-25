const Itinerary = require('../models/Itinerary');

// POST /api/itineraries
exports.createItinerary = async (req, res) => {
  try {
    req.body.user = req.user.id;
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
    let query = {};
    if (req.user.role !== 'admin' && req.user.role !== 'coadmin') {
      query.user = req.user.id;
    }
    
    const itineraries = await Itinerary.find(query)
      .populate('days.activities.destinationId')
      .populate('user', 'name email');
      
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

// GET /api/itineraries/my
exports.getMyItineraries = async (req, res) => {
  try {
    const itineraries = await Itinerary.find({ user: req.user.id })
      .populate('days.activities.destinationId');
      
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

// DELETE /api/itineraries/:id
exports.deleteItinerary = async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id);
    if (!itinerary) {
      return res.status(404).json({
        success: false,
        message: 'Itinerary not found',
      });
    }

    // Ensure user owns the itinerary or is an admin
    if (itinerary.user && itinerary.user.toString() !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'coadmin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this itinerary',
      });
    }

    await itinerary.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};
