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

module.exports = {
  addReview,
  getReviews,
};
