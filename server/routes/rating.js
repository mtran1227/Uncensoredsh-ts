const express = require('express');
const router = express.Router();

const Rating = require('../models/Rating');
const Bathroom = require('../models/Bathroom');
const VisitedBathroom = require('../models/VisitedBathroom');
const User = require('../models/User');

// ------------------------------------------------------
// CREATE or UPDATE a rating
// ------------------------------------------------------
router.post('/', async (req, res) => {
  try {
    const mongoose = require('mongoose');
    const { bathroomId, userEmail, userId, userName, ratings, comment } = req.body;

    // Convert bathroomId to ObjectId if it's a valid ObjectId string
    let normalizedBathroomId = bathroomId;
    if (mongoose.Types.ObjectId.isValid(bathroomId)) {
      normalizedBathroomId = mongoose.Types.ObjectId(bathroomId);
    }

    // Upsert = Create new OR update existing rating from same user
    const rating = await Rating.findOneAndUpdate(
      { bathroomId: normalizedBathroomId, userEmail },
      { bathroomId: normalizedBathroomId, userEmail, userId, userName, ratings, comment },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );

    // track visited
    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { visitedBathrooms: normalizedBathroomId } }
    );

    // Add to favorites (history) when user reviews a bathroom
    const user = await User.findById(userId);
    if (user) {
      const isInFavorites = user.favorites.some(id => id.toString() === normalizedBathroomId.toString());
      if (!isInFavorites) {
        // Remove from bucketlist if it's there (to prevent overlap)
        const wasInBucketList = user.bucketList.some(id => id.toString() === normalizedBathroomId.toString());
        if (wasInBucketList) {
          user.bucketList = user.bucketList.filter(id => id.toString() !== normalizedBathroomId.toString());
          user.bucketListCount = user.bucketList.length;
        }
        // Add to favorites (history)
        user.favorites.push(normalizedBathroomId);
        user.shitInCount = user.favorites.length;
        await user.save();
      }
    }

    // Add to favorites (history) when user reviews
    const user = await User.findById(userId);
    if (user) {
      const isInFavorites = user.favorites.some(id => id.toString() === normalizedBathroomId.toString());
      if (!isInFavorites) {
        // Remove from bucketlist if it's there (to prevent overlap)
        const wasInBucketList = user.bucketList.some(id => id.toString() === normalizedBathroomId.toString());
        if (wasInBucketList) {
          user.bucketList = user.bucketList.filter(id => id.toString() !== normalizedBathroomId.toString());
          user.bucketListCount = user.bucketList.length;
        }
        // Add to favorites
        user.favorites.push(normalizedBathroomId);
        user.shitInCount = user.favorites.length;
        await user.save();
      }
    }

    // ------------------------------------------------------
    // Recalculate bathroom average rating (blend hardcoded with user ratings)
    // ------------------------------------------------------
    const bathroom = await Bathroom.findById(normalizedBathroomId);
    const allRatings = await Rating.find({ bathroomId: normalizedBathroomId });

    // Get the original/hardcoded average (from seed data or initial value)
    const hardcodedAverage = bathroom.averageRating || 0;
    const hardcodedWeight = 2; // Weight for hardcoded average (acts like 2 reviews)
    
    if (allRatings.length > 0) {
      // Calculate average from user ratings
      const userRatingsSum = allRatings.reduce((sum, r) => sum + r.ratings.overall, 0);
      const userRatingsAvg = userRatingsSum / allRatings.length;
      
      // Blend: (hardcoded * weight + user ratings) / (weight + user count)
      const blendedAvg = (hardcodedAverage * hardcodedWeight + userRatingsSum) / (hardcodedWeight + allRatings.length);
      
      await Bathroom.findByIdAndUpdate(normalizedBathroomId, { averageRating: blendedAvg });
    } else {
      // If no user ratings yet, keep the hardcoded average
      await Bathroom.findByIdAndUpdate(normalizedBathroomId, { averageRating: hardcodedAverage });
    }

    // ------------------------------------------------------
    // LOG VISITED BATHROOM FOR GOOGLE MAPS
    // ------------------------------------------------------
    const bathroomForMap = await Bathroom.findById(normalizedBathroomId);

    if (bathroomForMap && bathroomForMap.geoLocation && bathroomForMap.geoLocation.coordinates) {
      await VisitedBathroom.findOneAndUpdate(
        { userId, bathroomId: normalizedBathroomId },
        {
          userId,
          bathroomId: normalizedBathroomId,
          geoLocation: {
            type: "Point",
            coordinates: bathroomForMap.geoLocation.coordinates
          }
        },
        { upsert: true, new: true }
      );
    }

    res.status(201).json(rating);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// ------------------------------------------------------
// GET all ratings for ONE bathroom (sorted by most recent)
// ------------------------------------------------------
router.get('/bathroom/:id', async (req, res) => {
  try {
    const mongoose = require('mongoose');
    const bathroomId = req.params.id;
    
    // First, find the bathroom to get its actual MongoDB _id
    let actualBathroomId = null;
    
    // Try to find by ObjectId first
    if (mongoose.Types.ObjectId.isValid(bathroomId)) {
      const bathroom = await Bathroom.findById(bathroomId);
      if (bathroom) {
        actualBathroomId = bathroom._id;
      }
    }
    
    // If not found by ObjectId, try to find by name (for fallback string IDs)
    if (!actualBathroomId) {
      // Convert string ID like "bobst-library-ll1" to a name pattern
      const namePattern = bathroomId
        .replace(/-/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase())
        .replace(/\bll1\b/gi, 'LL1')
        .replace(/\b(\d+)(st|nd|rd|th)\b/gi, '$1$2');
      
      const bathroom = await Bathroom.findOne({ 
        name: new RegExp(namePattern.replace(/\s+/g, '.*'), 'i') 
      });
      
      if (bathroom) {
        actualBathroomId = bathroom._id;
      }
    }
    
    // Build query using the actual bathroom _id
    let query = {};
    if (actualBathroomId) {
      // Use the actual MongoDB _id
      query = { bathroomId: actualBathroomId };
    } else {
      // Fallback: try both ObjectId and string format
      if (mongoose.Types.ObjectId.isValid(bathroomId)) {
        query = {
          $or: [
            { bathroomId: mongoose.Types.ObjectId(bathroomId) },
            { bathroomId: bathroomId }
          ]
        };
      } else {
        query = { bathroomId: bathroomId };
      }
    }
    
    const ratings = await Rating.find(query)
      .populate('userId', 'username profilePhoto')
      .sort({ createdAt: -1 }) // Most recent first
      .limit(50); // Limit to 50 most recent reviews

    res.json(ratings);
  } catch (err) {
    console.error("Error fetching reviews:", err);
    res.status(500).json({ error: err.message });
  }
});


// ------------------------------------------------------
// Get visited bathrooms for a user (for Google Maps pins)
// ------------------------------------------------------
router.get('/visited/:userId', async (req, res) => {
  try {
    const visited = await VisitedBathroom.find({ userId: req.params.userId })
      .populate("bathroomId", "name geoLocation");

    res.json(visited);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;