const Notification = require('../models/Notification');
const { sendEmail, emailTemplates } = require('../utils/emailService');

// @desc  Create notification
const createNotification = async (userId, type, title, message, metadata = {}) => {
  try {
    const notification = await Notification.create({
      userId,
      type,
      title,
      message,
      metadata,
    });
    return notification;
  } catch (error) {
    console.error('Failed to create notification:', error);
  }
};

// @desc  Get user notifications
// @route GET /api/notifications
// @access Private
const getMyNotifications = async (req, res, next) => {
  try {
    const { unreadOnly = false } = req.query;
    const filter = { userId: req.user._id };
    
    if (unreadOnly === 'true') {
      filter.isRead = false;
    }

    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({
      userId: req.user._id,
      isRead: false,
    });

    res.status(200).json({
      success: true,
      count: notifications.length,
      unreadCount,
      data: notifications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc  Mark notification as read
// @route PUT /api/notifications/:id/read
// @access Private
const markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        message: 'Notification not found',
      });
    }

    if (notification.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'Not authorized',
      });
    }

    notification.isRead = true;
    await notification.save();

    res.status(200).json({
      success: true,
      data: notification,
    });
  } catch (error) {
    next(error);
  }
};

// @desc  Mark all notifications as read
// @route PUT /api/notifications/read-all
// @access Private
const markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { userId: req.user._id, isRead: false },
      { isRead: true }
    );

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read',
    });
  } catch (error) {
    next(error);
  }
};

// @desc  Delete notification
// @route DELETE /api/notifications/:id
// @access Private
const deleteNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        message: 'Notification not found',
      });
    }

    if (notification.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'Not authorized',
      });
    }

    await notification.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Notification deleted',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createNotification,
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};
