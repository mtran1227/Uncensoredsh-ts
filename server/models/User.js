const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // --- Account Page Fields ---
  profilePhoto: { type: String, default: null },
  friends: { type: Number, default: 47 },
  shitInCount: { type: Number, default: 0 },
  bucketListCount: { type: Number, default: 0 },

  // Lists
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bathroom' }],
  bucketList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bathroom' }],
  visitedBathrooms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bathroom' }],
  friendsList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

// Hash password BEFORE saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);
