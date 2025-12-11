const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
    orderId: { type: String, required: true },
    paymentId: { type: String },
    signature: { type: String },
    amount: { type: Number, required: true }, // In smallest currency unit (paise)
    currency: { type: String, default: 'INR' },
    status: { type: String, enum: ['created', 'captured', 'failed'], default: 'created' },
    method: { type: String } // 'upi', 'card', etc.
}, { timestamps: true });

module.exports = mongoose.model('Payment', PaymentSchema);
