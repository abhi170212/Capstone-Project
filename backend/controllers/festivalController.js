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

module.exports = { getAllFestivals };
