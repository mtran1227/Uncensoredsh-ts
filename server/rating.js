const express = require('express');
const router = express.Router();
const Rating = require('../models/Rating');

// POST: Submit a new rating
router.post('/', async (req, res) => {
  const { location, rating } = req.body;
  try {
    const newRating = new Rating({ location, rating });
    await newRating.save();
    res.status(201).json({ message: 'Rating submitted!' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET: Average rating for a location
router.get('/:location', async (req, res) => {
  const location = req.params.location;
  try {
    const ratings = await Rating.find({ location });
    const average = ratings.reduce((sum, r) => sum + r.rating, 0) / (ratings.length || 1);
    res.json({ average: average.toFixed(2), count: ratings.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
