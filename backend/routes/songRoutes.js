const express = require('express');
const { getSongs, addSong, deleteSong } = require('../controllers/songController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(getSongs)
  .post(protect, admin, addSong);

router.route('/:id')
  .delete(protect, admin, deleteSong);

module.exports = router;
