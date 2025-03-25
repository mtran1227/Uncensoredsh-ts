const express = require('express');
const router = express.Router();
const Bathroom = require('../models/Bathroom');

// Get all bathrooms sorted by average rating
router.get('/ranked', async (req, res) => {
  try {
    const bathrooms = await Bathroom.find().sort({ averageRating: -1 });
    res.json(bathrooms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new bathroom
router.post('/', async (req, res) => {
  try {
    const { name, location } = req.body;
    const newBathroom = new Bathroom({ name, location });
    await newBathroom.save();
    res.json(newBathroom);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Submit a new rating
router.post('/:id/rate', async (req, res) => {
  const { score, userId } = req.body;
  try {
    const bathroom = await Bathroom.findById(req.params.id);
    if (!bathroom) return res.status(404).json({ error: 'Bathroom not found' });

    bathroom.ratings.push({ score, userId });
    bathroom.updateAverage();
    await bathroom.save();

    res.json(bathroom);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
