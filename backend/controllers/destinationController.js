const Destination = require('../models/Destination');

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

module.exports = {
  getAllDestinations,
  getDestinationById,
  addDestination,
  updateDestination,
  deleteDestination,
};
