const mongoose = require('mongoose');

const PricingRuleSchema = new mongoose.Schema({
    turf: { type: mongoose.Schema.Types.ObjectId, ref: 'Turf', required: true },
    name: { type: String, required: true }, // e.g., "Weekend Peak"
    dayOfWeek: [{ type: Number }], // 0=Sun, 1=Mon... (Array allows multiple days)
    startTime: { type: String, required: true }, // "18:00"
    endTime: { type: String, required: true },   // "22:00"
    adjustmentType: { type: String, enum: ['percentage', 'flat'], required: true }, // +20% or flat 800
    adjustmentValue: { type: Number, required: true }, // 20 or 800
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('PricingRule', PricingRuleSchema);
