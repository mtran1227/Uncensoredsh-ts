const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ratingRoutes = require('./routes/rating');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Import and use routes
const bathroomRoutes = require('./routes/bathrooms');
app.use('/api/bathrooms', bathroomRoutes);

const ratingRoutes = require('./routes/ratings');
app.use('/api/ratings', ratingRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/uncensoredsh-ts', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚽 Backend running on http://localhost:${PORT}`);
});
