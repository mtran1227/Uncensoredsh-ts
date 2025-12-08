const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  bathroomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bathroom',
    required: true
  },
  // User info
  userEmail: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  userName: String,
  
  // Rating breakdown (1-5 stars for each category)
  ratings: {
    cleanliness: { 
      type: Number, 
      required: true,
      min: 1,
      max: 5
    },
    privacy: { 
      type: Number, 
      required: true,
      min: 1,
      max: 5
    },
    smell: { 
      type: Number, 
      required: true,
      min: 1,
      max: 5
    },
    overall: { 
      type: Number, 
      required: true,
      min: 1,
      max: 5
    }
  },
  
  // Optional comment/review
  comment: {
    type: String,
    maxlength: 500
  },
  
  // Helpful votes (like thumbs up)
  helpful: {
    type: Number,
    default: 0
  },
  
  // Images attached to review
  images: [{
    url: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  
  reported: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

// Indexes for faster queries
ratingSchema.index({ bathroomId: 1, createdAt: -1 });
ratingSchema.index({ userEmail: 1, bathroomId: 1 }, { unique: true }); // Prevent duplicate ratings

module.exports = mongoose.model('Rating', ratingSchema);
