const express = require('express');
const router = express.Router();
const {
  addDestination,
  updateDestination,
  deleteDestination,
} = require('../controllers/destinationController');
const {
  getAllUsers,
  getUserById,
  deleteUser,
  updateUserRole,
} = require('../controllers/userController');
const {
  getAllReviews,
  deleteReview,
  getAnalytics,
} = require('../controllers/reviewController');
const { protect, admin } = require('../middleware/authMiddleware');

// All admin routes are protected
router.use(protect);
router.use(admin);

// Destination Management
router.post('/add-destination', addDestination);
router.put('/update-destination/:id', updateDestination);
router.delete('/delete-destination/:id', deleteDestination);

// User Management
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

// Review Moderation
router.get('/reviews', getAllReviews);
router.delete('/reviews/:id', deleteReview);

// Analytics
router.get('/analytics', getAnalytics);

module.exports = router;
