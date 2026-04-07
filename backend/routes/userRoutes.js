const express = require('express');
const router = express.Router();
const { 
  getDashboardData, 
  toggleFavorite,
  updateProfile
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/dashboard', protect, getDashboardData);
router.post('/favorites/:destinationId', protect, toggleFavorite);
router.put('/profile', protect, updateProfile);

module.exports = router;
