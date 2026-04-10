const express = require('express');
const router = express.Router();
const { 
  getDashboardData, 
  toggleFavorite,
  updateProfile,
  saveRoute,
  deleteRoute
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/dashboard', protect, getDashboardData);
router.post('/favorites/:destinationId', protect, toggleFavorite);
router.put('/profile', protect, updateProfile);
router.post('/routes', protect, saveRoute);
router.delete('/routes/:routeId', protect, deleteRoute);

module.exports = router;
