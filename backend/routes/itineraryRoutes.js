const express = require('express');
const router = express.Router();
const {
  createItinerary,
  getItineraries,
  getItineraryById,
  getMyItineraries,
  deleteItinerary,
} = require('../controllers/itineraryController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createItinerary);
router.get('/', protect, getItineraries);
router.get('/my', protect, getMyItineraries);
router.get('/:id', getItineraryById);
router.delete('/:id', protect, deleteItinerary);

module.exports = router;
