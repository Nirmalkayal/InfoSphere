const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
    turf: { type: mongoose.Schema.Types.ObjectId, ref: 'Turf', required: true },
    category: {
        type: String,
        enum: ['electricity', 'rent', 'labor', 'water', 'equipment', 'marketing', 'other'],
        required: true
    },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    description: { type: String },
    isRecurring: { type: Boolean, default: false },
    frequency: { type: String, enum: ['monthly', 'yearly', 'one_time'], default: 'one_time' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Expense', ExpenseSchema);
