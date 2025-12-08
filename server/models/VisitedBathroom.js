const mongoose = require('mongoose');

const visitedSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  bathroomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bathroom",
    required: true
  },
  geoLocation: {
    type: {
      type: String,
      default: "Point"
    },
    coordinates: {
      type: [Number], // [lng, lat]
      required: true
    }
  },
  visitedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("VisitedBathroom", visitedSchema);
