const express = require('express');
const router = express.Router();
const { getAllFestivals } = require('../controllers/festivalController');

// GET /api/festivals
router.get('/', getAllFestivals);

module.exports = router;
