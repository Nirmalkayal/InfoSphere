const mongoose = require('mongoose');

const TurfSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String },
  grounds: { type: Number, default: 0 },
  integrations: { type: Number, default: 0 },
  basePrice: { type: Number, default: 500 },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  meta: { type: Object }
}, { timestamps: true });

module.exports = mongoose.model('Turf', TurfSchema);
