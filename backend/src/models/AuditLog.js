const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
  action: { type: String, required: true },
  payload: { type: Object },
  meta: { type: Object }
}, { timestamps: true });

module.exports = mongoose.model('AuditLog', AuditLogSchema);
