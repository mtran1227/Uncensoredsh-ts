const express = require('express');
const router = express.Router();
const Bathroom = require('../models/Bathroom');
const User = require('../models/User');

// NYU Campus boundaries (Greenwich Village + Brooklyn campuses)
const NYU_BOUNDARIES = {
  // Main Washington Square Campus
  washingtonSquare: {
    minLat: 40.725,
    maxLat: 40.735,
    minLng: -74.002,
    maxLng: -73.990
  },
  // Brooklyn Campus (MetroTech)
  brooklyn: {
    minLat: 40.690,
    maxLat: 40.697,
    minLng: -73.990,
    maxLng: -73.980
  }
};

// Known NYU building keywords
const NYU_KEYWORDS = [
  'bobst', 'kimmel', 'tisch', 'stern', 'silver', 'palladium', 
  'metrotech', 'washington square', 'nyu', 'new york university',
  'courant', 'gcasl', 'steinhardt', 'gallatin', 'law', 'vanderbilt',
  'furman', 'd\'agostino', 'brown', 'king juan carlos', 'paulson',
  'studentlink', 'founders', 'brittany', 'goddard', 'lipton',
  'third north', 'university hall', 'carlyle', 'greenwich', 'rubin',
  'weinstein', 'clark street', 'jacobs', 'rogers', '370 jay',
  'dibner', 'makerspace', 'urban future lab', 'othmer'
];

/**
 * Validates if a location is within NYU campus boundaries
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {string} address - Address string
 * @param {string} name - Bathroom/building name
 * @returns {boolean} - True if location is valid NYU location
 */
function isValidNYULocation(lat, lng, address = '', name = '') {
  // Check coordinates against boundaries
  const inWashingtonSquare = 
    lat >= NYU_BOUNDARIES.washingtonSquare.minLat &&
    lat <= NYU_BOUNDARIES.washingtonSquare.maxLat &&
    lng >= NYU_BOUNDARIES.washingtonSquare.minLng &&
    lng <= NYU_BOUNDARIES.washingtonSquare.maxLng;
  
  const inBrooklyn = 
    lat >= NYU_BOUNDARIES.brooklyn.minLat &&
    lat <= NYU_BOUNDARIES.brooklyn.maxLat &&
    lng >= NYU_BOUNDARIES.brooklyn.minLng &&
    lng <= NYU_BOUNDARIES.brooklyn.maxLng;
  
  // Check if coordinates are within boundaries
  if (inWashingtonSquare || inBrooklyn) {
    return true;
  }
  
  // Fallback: Check address/name for NYU keywords (case-insensitive)
  const searchText = `${address} ${name}`.toLowerCase();
  const hasNYUKeyword = NYU_KEYWORDS.some(keyword => 
    searchText.includes(keyword.toLowerCase())
  );
  
  return hasNYUKeyword;
}

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
    const { geoLocation, location, name } = req.body;
    
    // Validate NYU location
    if (geoLocation && geoLocation.coordinates) {
      const [lng, lat] = geoLocation.coordinates;
      const address = geoLocation.address || location || '';
      const bathroomName = name || '';
      
      if (!isValidNYULocation(lat, lng, address, bathroomName)) {
        return res.status(403).json({ 
          error: 'Bathroom must be located at an NYU campus location. Please ensure the coordinates are within NYU campus boundaries (Washington Square or Brooklyn MetroTech areas).' 
        });
      }
    } else {
      // If no coordinates provided, check address/name only
      const address = geoLocation?.address || location || '';
      const bathroomName = name || '';
      const searchText = `${address} ${bathroomName}`.toLowerCase();
      const hasNYUKeyword = NYU_KEYWORDS.some(keyword => 
        searchText.includes(keyword.toLowerCase())
      );
      
      if (!hasNYUKeyword) {
        return res.status(403).json({ 
          error: 'Bathroom must be located at an NYU campus location. Please provide valid coordinates or an NYU building address.' 
        });
      }
    }
    
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
