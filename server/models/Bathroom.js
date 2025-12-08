const mongoose = require('mongoose');


const bathroomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  // Simple text location (keep for backward compatibility)
  location: String,
  
  // GeoJSON for Google Maps pin drops and nearby search
  geoLocation: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude] - IMPORTANT: lng first, then lat!
      required: false
    },
    address: String,
    building: String,
    floor: String,
    city: String,
    state: String,
    zipCode: String
  },
  
  // Amenities for filtering
  amenities: {
    accessible: { type: Boolean, default: false },
    genderNeutral: { type: Boolean, default: false },
    changingTable: { type: Boolean, default: false },
    bidet: { type: Boolean, default: false },
    soap: { type: Boolean, default: false },
    paperTowels: { type: Boolean, default: false },
    airDryer: { type: Boolean, default: false },
    freeToUse: { type: Boolean, default: true },
    requiresKey: { type: Boolean, default: false }
  },

  averageRating: {
    type: Number,
    default: 0
  },
  
  
  // Additional fields
  images: [{
    url: String,
    uploadedBy: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  verified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Create geospatial index for nearby bathroom searches
bathroomSchema.index({ geoLocation: '2dsphere' });


module.exports = mongoose.model('Bathroom', bathroomSchema);