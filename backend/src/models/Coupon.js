const mongoose = require('mongoose');

const CouponSchema = new mongoose.Schema({
    turf: { type: mongoose.Schema.Types.ObjectId, ref: 'Turf', required: true },
    code: { type: String, required: true, uppercase: true }, // e.g. SAVE20
    discountType: { type: String, enum: ['percentage', 'flat'], required: true },
    discountValue: { type: Number, required: true },
    minOrderValue: { type: Number, default: 0 },
    maxDiscount: { type: Number }, // Cap for percentage, e.g. up to 100
    expiryDate: { type: Date, required: true },
    usageLimit: { type: Number, default: 100 },
    usedCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Compound index to ensure unique code per turf
CouponSchema.index({ turf: 1, code: 1 }, { unique: true });

module.exports = mongoose.model('Coupon', CouponSchema);
