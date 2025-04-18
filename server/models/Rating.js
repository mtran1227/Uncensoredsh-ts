const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  location: { type: String, required: true }, // e.g., "NYU Bobst"
  rating: { type: Number, min: 1, max: 5, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Rating', ratingSchema);
