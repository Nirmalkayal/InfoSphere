const mongoose = require('mongoose');



const SlotSchema = new mongoose.Schema({
  turf: { type: mongoose.Schema.Types.ObjectId, ref: 'Turf', required: true },
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }, // Reference to confirmed booking

  // Time Definition
  start: { type: Date, required: true },
  end: { type: Date, required: true },

  // Commercials
  price: { type: Number },

  // Central Engine Status
  status: {
    type: String,
    enum: ['AVAILABLE', 'LOCKED', 'BOOKED', 'BLOCKED'],
    default: 'AVAILABLE'
  },

  // Locking Mechanism (The "Traffic Cop")
  lockedBy: { type: String, default: null }, // e.g. "PLAYO", "TURFTOWN", "INTERNAL"
  lockedAt: { type: Date, default: null },
  lockExpiresAt: { type: Date, default: null },

  // Metadata
  groundName: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Slot', SlotSchema);
