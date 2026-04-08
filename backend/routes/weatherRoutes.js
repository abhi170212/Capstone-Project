const express = require('express');
const router = express.Router();
const {
  getCurrentWeather,
  getWeatherRecommendation,
} = require('../controllers/weatherController');

// GET /api/weather/current?lat=x&lng=y
router.get('/current', getCurrentWeather);

// GET /api/weather/recommendation?month=January
router.get('/recommendation', getWeatherRecommendation);

module.exports = router;
