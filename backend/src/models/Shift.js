const mongoose = require('mongoose');

const ShiftSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    turf: { type: mongoose.Schema.Types.ObjectId, ref: 'Turf' },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    checkIn: { type: Date },
    checkOut: { type: Date },
    status: { type: String, enum: ['scheduled', 'present', 'absent', 'late'], default: 'scheduled' },
    notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Shift', ShiftSchema);
