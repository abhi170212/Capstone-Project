const express = require('express');
const router = express.Router();
const {
  getAttires,
  getAttireById,
  createAttire,
  updateAttire,
  deleteAttire
} = require('../controllers/attireController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getAttires)
  .post(protect, admin, createAttire);

router.route('/:id')
  .get(getAttireById)
  .put(protect, admin, updateAttire)
  .delete(protect, admin, deleteAttire);

module.exports = router;
