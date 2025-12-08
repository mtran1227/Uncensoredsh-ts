const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Register new user
router.post('/register', async (req, res) => {
  try {
    console.log("📨 REGISTER BODY:", req.body);
    const { username, email, password } = req.body;

    // Check if user already exists - WITH LONGER TIMEOUT
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    })
    .maxTimeMS(30000) // 30 second timeout for this query
    .exec();

    if (existingUser) {
      console.log("⚠️ User already exists");
      return res.status(400).json({ 
        error: 'User already exists with that email or username' 
      });
    }

    console.log("🔨 Creating new user...");
    // Create new user (password will be hashed automatically by User model)
    const user = new User({ username, email, password });
    await user.save();

    console.log("✅ User saved to database");

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log("✅ User registered successfully:", user.username);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error("❌ REGISTER ERROR:", error);
    return res.status(500).json({ error: error.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user by email or username
    const user = await User.findOne({ 
      $or: [{ email }, { username: email }] 
    });
    
    if (!user) {
      return res.status(401).json({ error: 'Username doesn\'t exist' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Wrong password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get current user profile (requires authentication)
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { username, bio } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { username, bio },
      { new: true, runValidators: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}

// TEST ROUTE - Create a test user (REMOVE IN PRODUCTION)
router.get('/add-test-user', async (req, res) => {
  try {
    const email = "test@example.com";
    const username = "testuser";
    const password = "password123";

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ message: "Test user already exists" });
    }

    const newUser = new User({ username, email, password });
    await newUser.save();

    res.json({ 
      message: '✅ Test user created', 
      user: { 
        username: newUser.username, 
        email: newUser.email 
      } 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get("/account", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");

    if (!user) return res.status(404).json({ error: "User not found" });

    // Sync friends count with actual friendsList length
    const actualFriendsCount = user.friendsList ? user.friendsList.length : 0;
    if (user.friends !== actualFriendsCount) {
      user.friends = actualFriendsCount;
      await user.save();
    }

    res.json({
      friends: actualFriendsCount,
      shitIn: user.shitInCount,
      bucketList: user.bucketListCount,
      profilePhoto: user.profilePhoto
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.post("/uploadPhoto", authenticateToken, async (req, res) => {
  // Coming soon — we will add Multer later
  return res.json({ message: "Photo upload not implemented yet" });
});
module.exports = router;