const express = require('express');
const router = express.Router();
const db = require('../db/database');

router.post('/', (req, res) => {
  const { name, days } = req.body; 
  
  try {
    const insert = db.prepare('INSERT INTO itineraries (name, days) VALUES (?, ?)');
    const info = insert.run(name, JSON.stringify(days));
    
    res.status(201).json({ id: info.lastInsertRowid, message: 'Itinerary saved successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM itineraries ORDER BY created_at DESC').all();
    const itineraries = rows.map(row => ({
      ...row,
      days: JSON.parse(row.days)
    }));
    res.json(itineraries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', (req, res) => {
  try {
    const row = db.prepare('SELECT * FROM itineraries WHERE id = ?').get(req.params.id);
    if (!row) {
      return res.status(404).json({ message: 'Itinerary not found' });
    }
    res.json({
      ...row,
      days: JSON.parse(row.days)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
