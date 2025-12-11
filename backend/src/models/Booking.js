const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    turf: { type: mongoose.Schema.Types.ObjectId, ref: 'Turf', required: true },
    slots: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Slot' }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    // Customer Details
    customerName: { type: String },
    customerPhone: { type: String },

    // Financials
    amount: { type: Number, required: true },

    // Booking Status
    status: { type: String, enum: ['PENDING', 'CONFIRMED', 'CANCELLED'], default: 'PENDING' },

    // Platform Source (Single Source of Truth)
    platform: {
        type: String,
        enum: ['PLAYO', 'TURFTOWN', 'WALK_IN', 'OWN_APP', 'WEB'],
        default: 'WALK_IN'
    },
    externalReferenceId: { type: String }, // ID from Playo/TurfTown

    // Payment
    paymentStatus: { type: String, enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED'], default: 'PENDING' },
    paymentSource: { type: String, enum: ['ONLINE', 'CASH', 'UPI'], default: 'CASH' }
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);
