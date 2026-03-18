const express = require('express');
const router = express.Router();
const destinations = require('../data/destinations.json');

router.post('/', (req, res) => {
  const { travelType, budget, season, interests } = req.body;
  
  let results = [...destinations];
  
  if (travelType && travelType !== 'all') {
    results = results.filter(d => d.category === travelType || d.category === 'both');
  }
  
  if (budget && budget !== 'all') {
    results = results.filter(d => d.budget === budget);
  }
  
  if (season && season !== 'all') {
    results = results.filter(d => d.season && d.season.includes(season.toLowerCase()));
  }
  
  if (interests && interests.length > 0) {
    results = results.filter(d => 
      d.interests && interests.some(interest => d.interests.includes(interest.toLowerCase()))
    );
  }
  
  results.sort((a, b) => (b.rating + b.ecoScore/2) - (a.rating + a.ecoScore/2));
  
  res.json(results);
});

module.exports = router;
