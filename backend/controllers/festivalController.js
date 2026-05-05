const Festival = require('../models/Festival');

// @desc  Get all festivals
// @route GET /api/festivals
const getAllFestivals = async (req, res, next) => {
  try {
    const festivals = await Festival.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: festivals.length,
      data: festivals,
    });
  } catch (error) {
    next(error);
  }
};

// @desc  Get single festival
// @route GET /api/festivals/:id
const getFestivalById = async (req, res, next) => {
  try {
    const festival = await Festival.findById(req.params.id);
    if (!festival) {
      return res.status(404).json({ success: false, message: 'Festival not found' });
    }
    res.status(200).json({
      success: true,
      data: festival,
    });
  } catch (error) {
    next(error);
  }
};

// @desc  Create a new festival
// @route POST /api/festivals
// @access Private/Admin
const createFestival = async (req, res, next) => {
  try {
    const festival = await Festival.create(req.body);
    res.status(201).json({
      success: true,
      data: festival,
    });
  } catch (error) {
    next(error);
  }
};

// @desc  Update a festival
// @route PUT /api/festivals/:id
// @access Private/Admin
const updateFestival = async (req, res, next) => {
  try {
    let festival = await Festival.findById(req.params.id);

    if (!festival) {
      return res.status(404).json({ success: false, message: 'Festival not found' });
    }

    festival = await Festival.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: festival,
    });
  } catch (error) {
    next(error);
  }
};

// @desc  Delete a festival
// @route DELETE /api/festivals/:id
// @access Private/Admin
const deleteFestival = async (req, res, next) => {
  try {
    const festival = await Festival.findById(req.params.id);

    if (!festival) {
      return res.status(404).json({ success: false, message: 'Festival not found' });
    }

    await festival.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
      message: 'Festival deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllFestivals, getFestivalById, createFestival, updateFestival, deleteFestival };
