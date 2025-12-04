const mongoose = require('mongoose');

const IntegrationLogSchema = new mongoose.Schema({
  platform: { type: String, required: true },
  endpoint: { type: String, required: true },
  method: { type: String, enum: ['GET','POST','PUT','DELETE'], required: true },
  status: { type: String, enum: ['success','failed'], required: true },
  responseTimeMs: { type: Number },
  dataRequested: { type: String },
  occurredAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('IntegrationLog', IntegrationLogSchema);
