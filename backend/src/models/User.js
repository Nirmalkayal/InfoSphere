const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'manager', 'staff'], default: 'staff' },
  status: { type: String, enum: ['active', 'pending'], default: 'active' },
  lastActiveAt: { type: Date },
  avatar: { type: String },
  turfId: { type: mongoose.Schema.Types.ObjectId, ref: 'Turf' } // Links user to a specific Tenant
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
