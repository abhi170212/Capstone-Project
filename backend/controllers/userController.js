const User = require('../models/User');
const Post = require('../models/Post');
const Review = require('../models/Review');
const Itinerary = require('../models/Itinerary');
const Booking = require('../models/Booking');

// @desc    Get user dashboard data
// @route   GET /api/users/dashboard
// @access  Private
const getDashboardData = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('favorites')
      .populate('createdTrips')
      .populate('likedSongs')
      .populate('playlists');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      coverImage: user.coverImage,
      favorites: user.favorites,
      createdTrips: user.createdTrips,
      savedRoutes: user.savedRoutes || [],
      likedSongs: user.likedSongs || [],
      playlists: user.playlists || [],
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

// @desc    Toggle like on a song
// @route   POST /api/users/songs/:songId/like
// @access  Private
const toggleLikeSong = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const songId = req.params.songId;

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isLiked = user.likedSongs.some(id => id.toString() === songId);

    if (isLiked) {
      user.likedSongs = user.likedSongs.filter((id) => id.toString() !== songId);
    } else {
      user.likedSongs.push(songId);
    }

    await user.save();
    
    // Populate the liked songs so frontend gets the full song objects
    await user.populate('likedSongs');
    
    res.json({ likedSongs: user.likedSongs });
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

    const posts = await Post.find({ user: req.params.id }).sort({ createdAt: -1 });

    const postsWithComments = await Post.find({ 'comments.user': req.params.id })
      .select('_id caption comments')
      .sort({ createdAt: -1 });

    let userComments = [];
    postsWithComments.forEach(post => {
      post.comments.forEach(comment => {
        if (comment.user.toString() === req.params.id) {
          userComments.push({
            _id: comment._id,
            postId: post._id,
            postCaption: post.caption,
            text: comment.text,
            date: comment.date
          });
        }
      });
    });

    res.json({
      success: true,
      data: {
        ...user.toObject(),
        posts,
        comments: userComments
      },
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
    const userId = req.params.id;
    const user = await User.findByIdAndDelete(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Cascade deletions to ensure no orphaned data remains
    await Post.deleteMany({ user: userId });
    await Review.deleteMany({ user: userId });
    await Itinerary.deleteMany({ user: userId });
    await Booking.deleteMany({ user: userId });
    
    // Remove user's likes and comments from all posts across the platform
    await Post.updateMany(
      {},
      { 
        $pull: { 
          likes: userId,
          comments: { user: userId }
        } 
      }
    );

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
    
    if (!['user', 'admin', 'coadmin', 'guest'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const targetUser = await User.findById(req.params.id);
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (targetUser.role === 'admin' && req.user.role !== 'system') { // Added quick check though 'system' isn't explicitly used, just to be safe.
      return res.status(403).json({ message: 'Cannot modify admin privileges' });
    }

    const requesterRole = req.user.role;
    
    // Co-Admin restrictions
    if (requesterRole === 'coadmin') {
      if (role === 'admin' || role === 'coadmin') {
        return res.status(403).json({ message: 'Coadmins cannot assign higher roles' });
      }
      if (targetUser.role === 'coadmin') {
         return res.status(403).json({ message: 'Coadmins cannot modify other coadmins' });
      }
    }

    targetUser.role = role;
    await targetUser.save();
    
    const userToReturn = targetUser.toObject();
    delete userToReturn.password;

    res.json({
      success: true,
      data: userToReturn,
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
  toggleLikeSong,
  banUser,
  unbanUser
};
