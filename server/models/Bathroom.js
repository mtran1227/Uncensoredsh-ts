const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  userEmail: String, // ← unique per user
  score: Number,
}, { _id: false });

const bathroomSchema = new mongoose.Schema({
  name: String,
  location: String,
  ratings: [ratingSchema],
  averageRating: {
    type: Number,
    default: 0
  }
});

bathroomSchema.methods.updateAverage = function () {
  if (this.ratings.length === 0) return 0;
  const total = this.ratings.reduce((acc, r) => acc + r.score, 0);
  this.averageRating = total / this.ratings.length;
  return this.averageRating;
};

module.exports = mongoose.model('Bathroom', bathroomSchema);
