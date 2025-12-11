const mongoose = require('mongoose');

const MaintenanceSchema = new mongoose.Schema({
    turf: { type: mongoose.Schema.Types.ObjectId, ref: 'Turf', required: true },
    type: {
        type: String,
        enum: ['cleaning', 'net_repair', 'lighting', 'grass_replacement', 'other'],
        required: true
    },
    description: { type: String },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    status: { type: String, enum: ['scheduled', 'in_progress', 'completed', 'cancelled'], default: 'scheduled' },
    cost: { type: Number, default: 0 },
    performedBy: { type: String }, // Supplier name or staff name
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Maintenance', MaintenanceSchema);
