const express = require('express');
const router = express.Router();
const { getAllDestinations } = require('../controllers/destinationController');

// GET /api/cultural — returns destinations filtered by type=cultural
router.get('/', (req, res, next) => {
  req.query.type = 'cultural';
  getAllDestinations(req, res, next);
});

module.exports = router;
