const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    batch: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true },
    name: { type: String, required: true },
    contact: { type: String, required: true },
    status: { type: String, enum: ['PAID', 'DUE', 'EXPIRED'], default: 'DUE' },
    joinDate: { type: Date, default: Date.now },
    renewalDate: { type: Date },
    paidAmount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Student', StudentSchema);
