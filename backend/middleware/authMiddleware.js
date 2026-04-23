const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }

      if (req.user.isBanned) {
        return res.status(403).json({ message: 'Your account has been banned due to policy violations.' });
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const admin = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'coadmin')) {
    next();
  } else {
    console.log('❌ Admin check failed for user:', {
      userId: req.user?._id,
      userEmail: req.user?.email,
      userRole: req.user?.role,
      hasUser: !!req.user,
    });
    res.status(403);
    throw new Error('Not authorized as admin');
  }
};

module.exports = { protect, admin };
