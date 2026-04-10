const express = require('express');
const router = express.Router();
const { 
  getDashboardData, 
  toggleFavorite,
  updateProfile,
  saveRoute,
  deleteRoute,
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
  banUser,
  unbanUser
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/dashboard', protect, getDashboardData);
router.post('/favorites/:destinationId', protect, toggleFavorite);
router.put('/profile', protect, updateProfile);
router.post('/routes', protect, saveRoute);
router.delete('/routes/:routeId', protect, deleteRoute);
router.get('/admin/users', protect, admin, getAllUsers);
router.get('/admin/users/:id', protect, admin, getUserById);
router.put('/admin/users/:id/role', protect, admin, updateUserRole);
router.delete('/admin/users/:id', protect, admin, deleteUser);
router.put('/admin/users/:id/ban', protect, admin, banUser);
router.put('/admin/users/:id/unban', protect, admin, unbanUser);

module.exports = router;
