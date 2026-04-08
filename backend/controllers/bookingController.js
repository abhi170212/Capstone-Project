const Booking = require('../models/Booking');
const Destination = require('../models/Destination');
const { createNotification } = require('./notificationController');
const { sendEmail, emailTemplates } = require('../utils/emailService');

// @desc  Create a new booking
// @route POST /api/bookings
// @access Private
const createBooking = async (req, res, next) => {
  try {
    const {
      bookingType,
      destinationId,
      title,
      description,
      startDate,
      endDate,
      guests,
      pricePerPerson,
      contactInfo,
      specialRequests,
    } = req.body;

    // Validate dates
    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({
        message: 'End date must be after start date',
      });
    }

    // Validate destination exists
    const destination = await Destination.findById(destinationId);
    if (!destination) {
      return res.status(404).json({
        message: 'Destination not found',
      });
    }

    const booking = await Booking.create({
      userId: req.user._id,
      bookingType,
      destinationId,
      title,
      description,
      startDate,
      endDate,
      guests,
      pricePerPerson,
      contactInfo,
      specialRequests,
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('userId', 'name email')
      .populate('destinationId', 'name location');

    // Create notification
    await createNotification(
      req.user._id,
      'booking_confirmation',
      'Booking Confirmed!',
      `Your booking for ${title} has been confirmed.`,
      { bookingId: booking._id }
    );

    // Send confirmation email
    try {
      await sendEmail({
        to: contactInfo.email,
        subject: 'Booking Confirmation - Bihar Tourism',
        html: emailTemplates.bookingConfirmation({
          ...populatedBooking.toObject(),
          destinationName: populatedBooking.destinationId.name,
        }),
      });
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
    }

    res.status(201).json({
      success: true,
      data: populatedBooking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc  Get user's bookings
// @route GET /api/bookings/my-bookings
// @access Private
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate('destinationId', 'name location images')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc  Get single booking
// @route GET /api/bookings/:id
// @access Private
const getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('destinationId', 'name location images description');

    if (!booking) {
      return res.status(404).json({
        message: 'Booking not found',
      });
    }

    // Check if booking belongs to user
    if (booking.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'Not authorized to view this booking',
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc  Cancel booking
// @route PUT /api/bookings/:id/cancel
// @access Private
const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: 'Booking not found',
      });
    }

    // Check if booking belongs to user
    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'Not authorized to cancel this booking',
      });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({
        message: 'Booking is already cancelled',
      });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc  Get all bookings (Admin)
// @route GET /api/bookings/admin/all
// @access Private/Admin
const getAllBookings = async (req, res, next) => {
  try {
    const { status, bookingType } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (bookingType) filter.bookingType = bookingType;

    const bookings = await Booking.find(filter)
      .populate('userId', 'name email')
      .populate('destinationId', 'name location')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc  Update booking status (Admin)
// @route PUT /api/bookings/:id/status
// @access Private/Admin
const updateBookingStatus = async (req, res, next) => {
  try {
    const { status, paymentStatus } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: 'Booking not found',
      });
    }

    if (status) booking.status = status;
    if (paymentStatus) booking.paymentStatus = paymentStatus;

    await booking.save();

    const updatedBooking = await Booking.findById(booking._id)
      .populate('userId', 'name email')
      .populate('destinationId', 'name location');

    res.status(200).json({
      success: true,
      data: updatedBooking,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getBooking,
  cancelBooking,
  getAllBookings,
  updateBookingStatus,
};
