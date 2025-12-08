const express = require('express');
const router = express.Router();
const Bathroom = require('../models/Bathroom');
const User = require('../models/User');

// GET all bathrooms (with optional filters + search)
router.get('/', async (req, res) => {
  try {
    const { accessible, genderNeutral, minRating, city, q } = req.query;
    
    let query = {};
    
    // Filters
    if (accessible === 'true') query['amenities.accessible'] = true;
    if (genderNeutral === 'true') query['amenities.genderNeutral'] = true;
    if (minRating) query['averageRating'] = { $gte: parseFloat(minRating) };
    if (city) query['geoLocation.city'] = new RegExp(city, 'i');
    if (q) query['name'] = new RegExp(q, 'i');
    
    const bathrooms = await Bathroom.find(query)
      .populate('addedBy', 'username')
      .sort({ averageRating: -1 });
    
    res.json(bathrooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET nearby bathrooms (for Google Maps)
// Example: /api/bathrooms/nearby?lat=40.7128&lng=-74.0060&maxDistance=5000
router.get('/nearby', async (req, res) => {
  try {
    const { lat, lng, maxDistance = 5000 } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitude and longitude required' });
    }
    
    const bathrooms = await Bathroom.find({
      geoLocation: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(maxDistance) // in meters
        }
      }
    }).populate('addedBy', 'username');
    
    res.json(bathrooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single bathroom by ID
router.get('/:id', async (req, res) => {
  try {
    const bathroom = await Bathroom.findById(req.params.id)
      .populate('addedBy', 'username');
    
    if (!bathroom) {
      return res.status(404).json({ error: 'Bathroom not found' });
    }
    
    res.json(bathroom);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create new bathroom (with Google Maps pin)
router.post('/', async (req, res) => {
  try {
    const bathroom = new Bathroom(req.body);
    await bathroom.save();
    res.status(201).json(bathroom);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// POST add rating to bathroom (legacy support)
router.post('/:id/rate', async (req, res) => {
  try {
    const { userEmail, score } = req.body;
    
    const bathroom = await Bathroom.findById(req.params.id);
    if (!bathroom) {
      return res.status(404).json({ error: 'Bathroom not found' });
    }
    
    // Check if user already rated
    const existingRating = bathroom.ratings.find(r => r.userEmail === userEmail);
    
    if (existingRating) {
      return res.status(400).json({ error: 'You have already rated this bathroom' });
    }
    
    // Add new rating
    bathroom.ratings.push({ userEmail, score });
    bathroom.updateAverage();
    await bathroom.save();
    
    res.json(bathroom);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT update bathroom
router.put('/:id', async (req, res) => {
  try {
    const bathroom = await Bathroom.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!bathroom) {
      return res.status(404).json({ error: 'Bathroom not found' });
    }
    
    res.json(bathroom);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE bathroom
router.delete('/:id', async (req, res) => {
  try {
    const bathroom = await Bathroom.findByIdAndDelete(req.params.id);
    
    if (!bathroom) {
      return res.status(404).json({ error: 'Bathroom not found' });
    }
    
    res.json({ message: 'Bathroom deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Get bathrooms the user has NOT visited yet (simple recommendation)
router.get('/recommended/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const all = await Bathroom.find({});

    // Remove visited ones
    const untried = all.filter(b => !user.visitedBathrooms.some(id => id.equals(b._id)));

    res.json(untried);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;
