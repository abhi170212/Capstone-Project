const Destination = require('../models/Destination');

// GET /api/recommendations
// Based on: travelType, budget, season, interests
exports.getRecommendations = async (req, res) => {
  try {
    const { travelType, budget, season, interests } = req.query;

    let query = {};

    if (travelType) {
      // Map travel types to destination types
      // Eco Tourism -> eco
      // Cultural Tourism -> cultural
      // Religious -> spiritual (or historical depending on data)
      if (travelType === 'Eco Tourism') query.type = 'eco';
      else if (travelType === 'Cultural Tourism') query.type = 'cultural';
      else if (travelType === 'Religious') query.type = 'historical';
    }

    if (budget) {
      query.budget = budget;
    }

    if (season) {
      // Simple string match or regex for season
      query.bestSeason = { $regex: season, $options: 'i' };
    }

    if (interests) {
      const interestsArray = Array.isArray(interests) ? interests : [interests];
      query.interests = { $in: interestsArray };
    }

    const recommendations = await Destination.find(query).limit(10);

    res.status(200).json({
      success: true,
      count: recommendations.length,
      data: recommendations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};
