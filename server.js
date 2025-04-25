require('dotenv').config();
console.log('Connecting to MongoDB:', process.env.MONGODB_URI);


const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected');

    // ✅ Import routes AFTER connection
    const bathroomRoutes = require('./server/routes/bathrooms');
    const ratingRoutes = require('./server/routes/rating');
    const authRoutes = require('./server/routes/auth');

    // ✅ Register routes
    app.use('/api/bathrooms', bathroomRoutes);
    app.use('/api/ratings', ratingRoutes);
    app.use('/api/auth', authRoutes);

    // ✅ Start server AFTER successful DB connection
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Backend running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
  });
