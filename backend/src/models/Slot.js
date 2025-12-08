const mongoose = require('mongoose');

const SlotSchema = new mongoose.Schema({
  turf: { type: mongoose.Schema.Types.ObjectId, ref: 'Turf', required: true },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  status: { type: String, enum: ['available','locked','booked'], default: 'available' },
  platform: { type: String },
  customerName: { type: String },
  groundName: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Slot', SlotSchema);
