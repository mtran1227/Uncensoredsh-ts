const express = require('express');
const router = express.Router();
const Bathroom = require('../models/Bathroom');
const User = require('../models/User');

// NYU Campus boundaries (NYC + Study Abroad locations)
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
  },
  // NYU Abu Dhabi, UAE
  abuDhabi: {
    minLat: 24.45,
    maxLat: 24.55,
    minLng: 54.35,
    maxLng: 54.45
  },
  // NYU Shanghai, China
  shanghai: {
    minLat: 31.20,
    maxLat: 31.25,
    minLng: 121.45,
    maxLng: 121.50
  },
  // NYU Buenos Aires, Argentina
  buenosAires: {
    minLat: -34.62,
    maxLat: -34.58,
    minLng: -58.42,
    maxLng: -58.38
  },
  // NYU Florence, Italy
  florence: {
    minLat: 43.76,
    maxLat: 43.78,
    minLng: 11.25,
    maxLng: 11.27
  },
  // NYU London, UK
  london: {
    minLat: 51.50,
    maxLat: 51.52,
    minLng: -0.13,
    maxLng: -0.11
  },
  // NYU Madrid, Spain
  madrid: {
    minLat: 40.42,
    maxLat: 40.44,
    minLng: -3.72,
    maxLng: -3.70
  },
  // NYU Paris, France
  paris: {
    minLat: 48.84,
    maxLat: 48.86,
    minLng: 2.32,
    maxLng: 2.34
  },
  // NYU Prague, Czech Republic
  prague: {
    minLat: 50.08,
    maxLat: 50.10,
    minLng: 14.40,
    maxLng: 14.42
  },
  // NYU Sydney, Australia
  sydney: {
    minLat: -33.88,
    maxLat: -33.86,
    minLng: 151.20,
    maxLng: 151.22
  },
  // NYU Tel Aviv, Israel
  telAviv: {
    minLat: 32.08,
    maxLat: 32.10,
    minLng: 34.78,
    maxLng: 34.80
  },
  // NYU Washington DC
  washingtonDC: {
    minLat: 38.90,
    maxLat: 38.92,
    minLng: -77.05,
    maxLng: -77.03
  },
  // NYU Accra, Ghana
  accra: {
    minLat: 5.55,
    maxLat: 5.57,
    minLng: -0.20,
    maxLng: -0.18
  },
  // NYU Berlin, Germany
  berlin: {
    minLat: 52.50,
    maxLat: 52.52,
    minLng: 13.38,
    maxLng: 13.40
  }
};

// Known NYU building keywords (NYC + Study Abroad)
const NYU_KEYWORDS = [
  // NYC campuses
  'bobst', 'kimmel', 'tisch', 'stern', 'silver', 'palladium', 
  'metrotech', 'washington square', 'nyu', 'new york university',
  'courant', 'gcasl', 'steinhardt', 'gallatin', 'law', 'vanderbilt',
  'furman', 'd\'agostino', 'brown', 'king juan carlos', 'paulson',
  'studentlink', 'founders', 'brittany', 'goddard', 'lipton',
  'third north', 'university hall', 'carlyle', 'greenwich', 'rubin',
  'weinstein', 'clark street', 'jacobs', 'rogers', '370 jay',
  'dibner', 'makerspace', 'urban future lab', 'othmer',
  // Study abroad locations
  'nyu abu dhabi', 'nyu ad', 'abu dhabi',
  'nyu shanghai', 'nyu sh',
  'nyu buenos aires', 'nyu ba',
  'nyu florence', 'nyu florence villa ulivi', 'villa ulivi',
  'nyu london', 'nyu bedford square',
  'nyu madrid', 'nyu madrid campus',
  'nyu paris', 'nyu paris campus',
  'nyu prague', 'nyu prague campus',
  'nyu sydney', 'nyu sydney campus',
  'nyu tel aviv', 'nyu ta',
  'nyu washington dc', 'nyu dc',
  'nyu accra', 'nyu ghana',
  'nyu berlin', 'nyu berlin campus'
];

/**
 * Validates if a location is within NYU campus boundaries (NYC + Study Abroad)
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {string} address - Address string
 * @param {string} name - Bathroom/building name
 * @returns {boolean} - True if location is valid NYU location
 */
function isValidNYULocation(lat, lng, address = '', name = '') {
  // Check coordinates against all NYU campus boundaries
  for (const [campusName, boundary] of Object.entries(NYU_BOUNDARIES)) {
    const inBoundary = 
      lat >= boundary.minLat &&
      lat <= boundary.maxLat &&
      lng >= boundary.minLng &&
      lng <= boundary.maxLng;
    
    if (inBoundary) {
      return true;
    }
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
          error: 'Bathroom must be located at an NYU campus location (NYC or study abroad). Please ensure the coordinates are within NYU campus boundaries.' 
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
          error: 'Bathroom must be located at an NYU campus location (NYC or study abroad). Please provide valid coordinates or an NYU building address.' 
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
