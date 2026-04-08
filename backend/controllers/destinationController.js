const Destination = require('../models/Destination');

// Helper function to calculate distance between two coordinates (Haversine formula)
const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

// @desc  Get all destinations (optional ?type= filter)
// @route GET /api/destinations
const getAllDestinations = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.type) {
      filter.type = req.query.type;
    }
    const destinations = await Destination.find(filter).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: destinations.length,
      data: destinations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc  Get single destination by ID
// @route GET /api/destinations/:id
const getDestinationById = async (req, res, next) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) {
      const error = new Error(`Destination not found with id ${req.params.id}`);
      error.statusCode = 404;
      return next(error);
    }
    res.status(200).json({
      success: true,
      data: destination,
    });
  } catch (error) {
    next(error);
  }
};

// @desc  Add a new destination (Admin)
// @route POST /api/admin/add-destination
const addDestination = async (req, res, next) => {
  try {
    const destination = await Destination.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Destination added successfully',
      data: destination,
    });
  } catch (error) {
    next(error);
  }
};

// @desc  Update destination (Admin)
// @route PUT /api/admin/update-destination/:id
const updateDestination = async (req, res, next) => {
  try {
    const destination = await Destination.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!destination) {
      const error = new Error(`Destination not found with id ${req.params.id}`);
      error.statusCode = 404;
      return next(error);
    }
    res.status(200).json({
      success: true,
      message: 'Destination updated successfully',
      data: destination,
    });
  } catch (error) {
    next(error);
  }
};

// @desc  Delete destination (Admin)
// @route DELETE /api/admin/delete-destination/:id
const deleteDestination = async (req, res, next) => {
  try {
    const destination = await Destination.findByIdAndDelete(req.params.id);
    if (!destination) {
      const error = new Error(`Destination not found with id ${req.params.id}`);
      error.statusCode = 404;
      return next(error);
    }
    res.status(200).json({
      success: true,
      message: 'Destination deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc  Get nearby attractions
// @route GET /api/destinations/:id/nearby?radius=50
const getNearbyAttractions = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { radius = 50 } = req.query; // Default 50km radius

    // Get the main destination
    const mainDestination = await Destination.findById(id);
    if (!mainDestination) {
      const error = new Error('Destination not found');
      error.statusCode = 404;
      return next(error);
    }

    // Get all destinations
    const allDestinations = await Destination.find({ _id: { $ne: id } });

    // Calculate distances and filter
    const nearby = allDestinations
      .map(dest => {
        const distance = calculateDistance(
          mainDestination.coordinates.lat,
          mainDestination.coordinates.lng,
          dest.coordinates.lat,
          dest.coordinates.lng
        );
        return { ...dest.toObject(), distance: Math.round(distance * 10) / 10 };
      })
      .filter(dest => dest.distance <= parseFloat(radius))
      .sort((a, b) => a.distance - b.distance);

    res.status(200).json({
      success: true,
      count: nearby.length,
      data: nearby,
    });
  } catch (error) {
    next(error);
  }
};

// @desc  Calculate route between multiple destinations
// @route POST /api/destinations/route
const calculateRoute = async (req, res, next) => {
  try {
    const { destinations } = req.body; // Array of destination IDs

    if (!destinations || destinations.length < 2) {
      return res.status(400).json({
        message: 'At least 2 destinations required',
      });
    }

    // Fetch all destinations
    const destinationDocs = await Destination.find({
      _id: { $in: destinations },
    });

    // Calculate route
    const route = [];
    let totalDistance = 0;

    for (let i = 0; i < destinationDocs.length - 1; i++) {
      const from = destinationDocs[i];
      const to = destinationDocs[i + 1];

      const distance = calculateDistance(
        from.coordinates.lat,
        from.coordinates.lng,
        to.coordinates.lat,
        to.coordinates.lng
      );

      // Estimate travel time (average 40 km/h for Bihar roads)
      const estimatedTime = (distance / 40) * 60; // in minutes

      totalDistance += distance;

      route.push({
        from: {
          id: from._id,
          name: from.name,
          location: from.location,
        },
        to: {
          id: to._id,
          name: to.name,
          location: to.location,
        },
        distance: Math.round(distance * 10) / 10,
        estimatedTime: Math.round(estimatedTime),
      });
    }

    res.status(200).json({
      success: true,
      data: {
        route,
        totalDistance: Math.round(totalDistance * 10) / 10,
        totalTime: Math.round(route.reduce((sum, r) => sum + r.estimatedTime, 0)),
        stops: destinationDocs.map(d => ({
          id: d._id,
          name: d.name,
          location: d.location,
          coordinates: d.coordinates,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllDestinations,
  getDestinationById,
  addDestination,
  updateDestination,
  deleteDestination,
  getNearbyAttractions,
  calculateRoute,
};
