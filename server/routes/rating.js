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

    // Find the actual bathroom to get its MongoDB _id
    let actualBathroomId = null;
    let actualBathroom = null;
    
    // Try to find by ObjectId first
    if (mongoose.Types.ObjectId.isValid(bathroomId)) {
      actualBathroom = await Bathroom.findById(bathroomId);
      if (actualBathroom) {
        actualBathroomId = actualBathroom._id;
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
      
      actualBathroom = await Bathroom.findOne({ 
        name: new RegExp(namePattern.replace(/\s+/g, '.*'), 'i') 
      });
      
      if (actualBathroom) {
        actualBathroomId = actualBathroom._id;
      }
    }
    
    // If still not found, use the provided bathroomId (might be a string ID for fallback)
    if (!actualBathroomId) {
      actualBathroomId = mongoose.Types.ObjectId.isValid(bathroomId) 
        ? mongoose.Types.ObjectId(bathroomId) 
        : bathroomId;
    }

    // Check if user has this bathroom in their history (favorites) before allowing review
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if bathroom is in user's favorites (history)
    const isInHistory = user.favorites.some(id => {
      const favId = id.toString();
      const bathroomIdStr = actualBathroomId.toString();
      return favId === bathroomIdStr;
    });

    if (!isInHistory) {
      return res.status(403).json({ 
        error: "You can only review bathrooms that are in your history. Please add this bathroom to your history first." 
      });
    }

    // Upsert = Create new OR update existing rating from same user
    const rating = await Rating.findOneAndUpdate(
      { bathroomId: actualBathroomId, userEmail },
      { bathroomId: actualBathroomId, userEmail, userId, userName, ratings, comment },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );

    // track visited
    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { visitedBathrooms: actualBathroomId } }
    );

    // Add to favorites (history) when user reviews a bathroom (already checked above, but ensure it's added)
    if (user && actualBathroomId) {
      // Only add ObjectIds to favorites (skip string IDs that don't exist in DB)
      if (mongoose.Types.ObjectId.isValid(actualBathroomId)) {
        const isInFavorites = user.favorites.some(id => id.toString() === actualBathroomId.toString());
        if (!isInFavorites) {
          // Remove from bucketlist if it's there (to prevent overlap)
          const wasInBucketList = user.bucketList.some(id => id.toString() === actualBathroomId.toString());
          if (wasInBucketList) {
            user.bucketList = user.bucketList.filter(id => id.toString() !== actualBathroomId.toString());
            user.bucketListCount = user.bucketList.length;
          }
          // Add to favorites (history)
          user.favorites.push(actualBathroomId);
          user.shitInCount = user.favorites.length;
          await user.save();
        } else {
          // Even if already in favorites, ensure shitInCount is synced
          user.shitInCount = user.favorites.length;
          await user.save();
        }
      }
    }

    // ------------------------------------------------------
    // Recalculate bathroom average rating (blend hardcoded with user ratings)
    // ------------------------------------------------------
    const bathroom = await Bathroom.findById(actualBathroomId);
    const allRatings = await Rating.find({ bathroomId: actualBathroomId });

    // Get the original/hardcoded average (from seed data or initial value)
    const hardcodedAverage = bathroom.averageRating || 0;
    const hardcodedWeight = 2; // Weight for hardcoded average (acts like 2 reviews)
    
    if (allRatings.length > 0) {
      // Calculate average from user ratings
      const userRatingsSum = allRatings.reduce((sum, r) => sum + r.ratings.overall, 0);
      const userRatingsAvg = userRatingsSum / allRatings.length;
      
      // Blend: (hardcoded * weight + user ratings) / (weight + user count)
      const blendedAvg = (hardcodedAverage * hardcodedWeight + userRatingsSum) / (hardcodedWeight + allRatings.length);
      
      await Bathroom.findByIdAndUpdate(actualBathroomId, { averageRating: blendedAvg });
    } else {
      // If no user ratings yet, keep the hardcoded average
      await Bathroom.findByIdAndUpdate(actualBathroomId, { averageRating: hardcodedAverage });
    }

    // ------------------------------------------------------
    // LOG VISITED BATHROOM FOR GOOGLE MAPS
    // ------------------------------------------------------
    const bathroomForMap = await Bathroom.findById(actualBathroomId);

    if (bathroomForMap && bathroomForMap.geoLocation && bathroomForMap.geoLocation.coordinates) {
      await VisitedBathroom.findOneAndUpdate(
        { userId, bathroomId: actualBathroomId },
        {
          userId,
          bathroomId: actualBathroomId,
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