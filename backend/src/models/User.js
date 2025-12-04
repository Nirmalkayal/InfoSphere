const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['admin','manager','staff'], default: 'staff' },
  status: { type: String, enum: ['active','pending'], default: 'active' },
  lastActiveAt: { type: Date },
  avatar: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
