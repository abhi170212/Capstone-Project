const EcoSite = require('../models/EcoSite');

// @desc  Get all eco sites
// @route GET /api/ecotourism
const getAllEcoSites = async (req, res, next) => {
  try {
    const ecoSites = await EcoSite.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: ecoSites.length,
      data: ecoSites,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllEcoSites };
