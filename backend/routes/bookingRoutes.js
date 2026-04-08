const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getBooking,
  cancelBooking,
  getAllBookings,
  updateBookingStatus,
} = require('../controllers/bookingController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes (none for bookings)

// Protected routes
router.post('/', protect, createBooking);
router.get('/my-bookings', protect, getMyBookings);
router.get('/:id', protect, getBooking);
router.put('/:id/cancel', protect, cancelBooking);

// Admin routes
router.get('/admin/all', protect, admin, getAllBookings);
router.put('/:id/status', protect, admin, updateBookingStatus);

module.exports = router;
