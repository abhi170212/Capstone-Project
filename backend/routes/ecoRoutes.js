const express = require('express');
const router = express.Router();
const { getAllEcoSites } = require('../controllers/ecoSiteController');

// GET /api/ecotourism
router.get('/', getAllEcoSites);

module.exports = router;
