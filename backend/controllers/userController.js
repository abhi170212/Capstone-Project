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
      savedRoutes: user.savedRoutes || [],
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

// @desc    Save a route for navigation
// @route   POST /api/users/routes
// @access  Private
const saveRoute = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const exists = user.savedRoutes.some(r => r.destinationName === req.body.destinationName);
    if (exists) {
      return res.status(400).json({ message: 'Route for this destination is already saved.' });
    }

    user.savedRoutes.push(req.body);
    await user.save();
    
    res.json({ savedRoutes: user.savedRoutes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a saved route
// @route   DELETE /api/users/routes/:routeId
// @access  Private
const deleteRoute = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.savedRoutes = user.savedRoutes.filter(route => route._id.toString() !== req.params.routeId);
    await user.save();
    
    res.json({ savedRoutes: user.savedRoutes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all users (Admin)
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user by ID (Admin)
// @route   GET /api/admin/users/:id
// @access  Private/Admin
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('favorites')
      .populate('createdTrips');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete user (Admin)
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user role (Admin)
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    
    if (req.body.avatar !== undefined) user.avatar = req.body.avatar;
    if (req.body.bio !== undefined) user.bio = req.body.bio;
    if (req.body.coverImage !== undefined) user.coverImage = req.body.coverImage;

    // Update password if provided
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      avatar: updatedUser.avatar,
      bio: updatedUser.bio,
      coverImage: updatedUser.coverImage,
      token: require('jsonwebtoken').sign(
        { id: updatedUser._id },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
      ),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating profile' });
  }
};

// @desc    Ban User
// @route   PUT /api/admin/users/:id/ban
// @access  Private/Admin
const banUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'admin') return res.status(400).json({ message: 'Cannot ban an admin' });

    user.isBanned = true;
    await user.save();
    res.json({ message: 'User has been banned successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error banning user' });
  }
};

// @desc    Unban User
// @route   PUT /api/admin/users/:id/unban
// @access  Private/Admin
const unbanUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isBanned = false;
    await user.save();
    res.json({ message: 'User has been unbanned successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error unbanning user' });
  }
};

// @desc    Generate AI Avatar
// @route   POST /api/users/generate-avatar
// @access  Private
const generateAvatar = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ message: 'Prompt is required' });

    // Mocking Gemini / OpenAI API response utilizing Dicebear bottts API for instant resolution
    const seed = encodeURIComponent(prompt.trim().replace(/\s+/g, '-'));
    
    // Different styles based on prompt keywords
    let style = 'bottts'; // default
    if (prompt.toLowerCase().includes('anime')) style = 'fun-emoji';
    if (prompt.toLowerCase().includes('minimalist')) style = 'initials';
    if (prompt.toLowerCase().includes('pixel')) style = 'pixel-art';
    if (prompt.toLowerCase().includes('cyberpunk')) style = 'bottts-neutral';

    const avatarUrl = `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffdfbf,ffd5dc`;

    res.json({ url: avatarUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to generate avatar' });
  }
};

module.exports = {
  getDashboardData,
  toggleFavorite,
  getAllUsers,
  getUserById,
  deleteUser,
  updateUserRole,
  updateProfile,
  generateAvatar,
  saveRoute,
  deleteRoute,
  banUser,
  unbanUser
};
