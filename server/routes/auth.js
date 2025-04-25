const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');

// REGISTER


router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10); // 🔐 secure hash
    const newUser = new User({ email, password: hashedPassword });

    await newUser.save();
    res.status(201).json({ message: 'User created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid email or password' });

    res.status(200).json({ message: 'Login successful', user: { email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
// TEMP TEST ROUTE to insert a test user manually


router.get('/add-test-user', async (req, res) => {
  try {
    const email = "test@example.com";
    const password = "password123";

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.json({ message: "User already exists" });

    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    res.json({ message: '✅ Test user created', user: newUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
