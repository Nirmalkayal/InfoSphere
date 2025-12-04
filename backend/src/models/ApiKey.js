const mongoose = require('mongoose');

const ApiKeySchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  name: { type: String },
  platform: { type: String },
  revoked: { type: Boolean, default: false },
  lastUsedAt: { type: Date },
  rateLimitPerHour: { type: Number }
}, { timestamps: true });

module.exports = mongoose.model('ApiKey', ApiKeySchema);
