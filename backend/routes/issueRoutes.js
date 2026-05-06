const express = require('express');
const router = express.Router();
const {
  createIssue,
  getMyIssues,
  getAllIssues,
  updateIssue,
  deleteIssue,
} = require('../controllers/issueController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, admin, getAllIssues)
  .post(protect, createIssue);

router.route('/my')
  .get(protect, getMyIssues);

router.route('/:id')
  .put(protect, admin, updateIssue)
  .delete(protect, admin, deleteIssue);

module.exports = router;
