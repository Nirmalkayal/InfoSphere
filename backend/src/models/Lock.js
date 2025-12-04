const mongoose = require('mongoose');

const LockSchema = new mongoose.Schema({
  slot: { type: mongoose.Schema.Types.ObjectId, ref: 'Slot', required: true },
  apiKey: { type: mongoose.Schema.Types.ObjectId, ref: 'ApiKey' },
  expiresAt: { type: Date, required: true },
  meta: { type: Object }
}, { timestamps: true });

module.exports = mongoose.model('Lock', LockSchema);
