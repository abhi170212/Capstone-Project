const express = require('express');
const router = express.Router();
const {
  createItinerary,
  getItineraries,
  getItineraryById,
} = require('../controllers/itineraryController');

router.post('/', createItinerary);
router.get('/', getItineraries);
router.get('/:id', getItineraryById);

module.exports = router;
