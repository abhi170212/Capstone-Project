const express = require('express');
const router = express.Router();
const {
  getAllDestinations,
  getDestinationById,
  getNearbyAttractions,
  calculateRoute,
} = require('../controllers/destinationController');

// GET /api/destinations
router.get('/', getAllDestinations);

// GET /api/destinations/:id
router.get('/:id', getDestinationById);

// GET /api/destinations/:id/nearby
router.get('/:id/nearby', getNearbyAttractions);

// POST /api/destinations/route
router.post('/route', calculateRoute);

module.exports = router;
