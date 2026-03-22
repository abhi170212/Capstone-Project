const express = require('express');
const router = express.Router();
const {
  addDestination,
  updateDestination,
  deleteDestination,
} = require('../controllers/destinationController');

// POST /api/admin/add-destination
router.post('/add-destination', addDestination);

// PUT /api/admin/update-destination/:id
router.put('/update-destination/:id', updateDestination);

// DELETE /api/admin/delete-destination/:id
router.delete('/delete-destination/:id', deleteDestination);

module.exports = router;
