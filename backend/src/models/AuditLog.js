const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
  action: { type: String, required: true },
  platform: { type: String },
  payload: { type: Object },
  meta: { type: Object }
}, { timestamps: true });

module.exports = mongoose.model('AuditLog', AuditLogSchema);
