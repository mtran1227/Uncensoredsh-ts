// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// commented out import routes bc database is not connecting w them
//const bathroomRoutes = require('./routes/bathrooms');
//app.use('/api/bathrooms', bathroomRoutes);

//const ratingRoutes = require('./routes/rating');
//app.use('/api/ratings', ratingRoutes);

// Connect to MongoDB using the new URI from .env
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
