const User = require('../models/User');

// @desc    Get user dashboard data
// @route   GET /api/users/dashboard
// @access  Private
const getDashboardData = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('favorites')
      .populate('createdTrips');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      favorites: user.favorites,
      createdTrips: user.createdTrips,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Toggle favorite destination
// @route   POST /api/users/favorites/:destinationId
// @access  Private
const toggleFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const destinationId = req.params.destinationId;

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isFavorite = user.favorites.some(id => id.toString() === destinationId);

    if (isFavorite) {
      user.favorites = user.favorites.filter((id) => id.toString() !== destinationId);
    } else {
      user.favorites.push(destinationId);
    }

    await user.save();
    
    res.json({ favorites: user.favorites });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getDashboardData,
  toggleFavorite,
};
