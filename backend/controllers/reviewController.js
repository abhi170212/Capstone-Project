const Review = require('../models/Review');
const Destination = require('../models/Destination');

// @desc    Add a review
// @route   POST /api/reviews
// @access  Private
const addReview = async (req, res) => {
  try {
    const { destinationId, rating, comment } = req.body;

    if (!destinationId || !rating || !comment) {
      return res.status(400).json({ message: 'Please provide all fields' });
    }

    const review = await Review.create({
      userId: req.user.id,
      destinationId,
      rating,
      comment
    });

    const populatedReview = await Review.findById(review._id).populate('userId', 'name');

    res.status(201).json(populatedReview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get reviews for a destination
// @route   GET /api/reviews/:destinationId
// @access  Public
const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ destinationId: req.params.destinationId })
      .populate('userId', 'name')
      .sort({ date: -1 });

    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all reviews (Admin)
// @route   GET /api/admin/reviews
// @access  Private/Admin
const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('userId', 'name email')
      .populate('destinationId', 'name')
      .sort({ date: -1 });

    res.json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete review (Admin)
// @route   DELETE /api/admin/reviews/:id
// @access  Private/Admin
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get analytics data (Admin)
// @route   GET /api/admin/analytics
// @access  Private/Admin
const getAnalytics = async (req, res) => {
  try {
    const User = require('../models/User');
    const Destination = require('../models/Destination');
    const Itinerary = require('../models/Itinerary');
    const Festival = require('../models/Festival');

    // Get counts
    const totalUsers = await User.countDocuments();
    const totalDestinations = await Destination.countDocuments();
    const totalReviews = await Review.countDocuments();
    const totalItineraries = await Itinerary.countDocuments();
    const totalFestivals = await Festival.countDocuments();

    // Get average rating
    const ratingStats = await Review.aggregate([
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    // Get reviews by destination
    const reviewsByDestination = await Review.aggregate([
      {
        $group: {
          _id: '$destinationId',
          count: { $sum: 1 },
          averageRating: { $avg: '$rating' },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // Populate destination names
    const populatedDestinations = await Destination.find({
      _id: { $in: reviewsByDestination.map(r => r._id) },
    }).select('name');

    const analytics = {
      totalUsers,
      totalDestinations,
      totalReviews,
      totalItineraries,
      totalFestivals,
      averageRating: ratingStats[0]?.averageRating?.toFixed(1) || 0,
      topDestinations: reviewsByDestination.map(r => {
        const dest = populatedDestinations.find(d => d._id.toString() === r._id.toString());
        return {
          destinationId: r._id,
          name: dest?.name || 'Unknown',
          reviewCount: r.count,
          averageRating: r.averageRating.toFixed(1),
        };
      }),
    };

    res.json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  addReview,
  getReviews,
  getAllReviews,
  deleteReview,
  getAnalytics,
};
