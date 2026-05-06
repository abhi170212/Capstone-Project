const Issue = require('../models/Issue');

// @desc  Create a new issue (logged-in user)
// @route POST /api/issues
// @access Private
const createIssue = async (req, res, next) => {
  try {
    const { subject, category, message } = req.body;
    const issue = await Issue.create({
      user: req.user._id,
      subject,
      category,
      message,
    });
    res.status(201).json({ success: true, data: issue });
  } catch (error) {
    next(error);
  }
};

// @desc  Get issues for the logged-in user
// @route GET /api/issues/my
// @access Private
const getMyIssues = async (req, res, next) => {
  try {
    const issues = await Issue.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: issues.length, data: issues });
  } catch (error) {
    next(error);
  }
};

// @desc  Get all issues (admin)
// @route GET /api/issues
// @access Private/Admin
const getAllIssues = async (req, res, next) => {
  try {
    const issues = await Issue.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: issues.length, data: issues });
  } catch (error) {
    next(error);
  }
};

// @desc  Update issue status / reply (admin)
// @route PUT /api/issues/:id
// @access Private/Admin
const updateIssue = async (req, res, next) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ success: false, message: 'Issue not found' });
    }
    const updated = await Issue.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('user', 'name email');
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

// @desc  Delete an issue (admin)
// @route DELETE /api/issues/:id
// @access Private/Admin
const deleteIssue = async (req, res, next) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ success: false, message: 'Issue not found' });
    }
    await issue.deleteOne();
    res.status(200).json({ success: true, data: {}, message: 'Issue deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { createIssue, getMyIssues, getAllIssues, updateIssue, deleteIssue };
