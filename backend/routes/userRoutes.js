const express = require('express');
const router = express.Router();
const { getDashboardData, toggleFavorite } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/dashboard', protect, getDashboardData);
router.post('/favorites/:destinationId', protect, toggleFavorite);

module.exports = router;
