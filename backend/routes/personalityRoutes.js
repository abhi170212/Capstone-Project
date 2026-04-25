const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  getPersonalities,
  createPersonality,
  updatePersonality,
  deletePersonality,
} = require('../controllers/personalityController');

router.route('/')
  .get(getPersonalities)
  .post(protect, admin, createPersonality);

router.route('/:id')
  .put(protect, admin, updatePersonality)
  .delete(protect, admin, deletePersonality);

module.exports = router;
