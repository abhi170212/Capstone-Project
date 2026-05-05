const express = require('express');
const router = express.Router();
const { 
  getAllFestivals,
  getFestivalById,
  createFestival,
  updateFestival,
  deleteFestival
} = require('../controllers/festivalController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getAllFestivals)
  .post(protect, admin, createFestival);

router.route('/:id')
  .get(getFestivalById)
  .put(protect, admin, updateFestival)
  .delete(protect, admin, deleteFestival);

module.exports = router;
