const mongoose = require('mongoose');

const BatchSchema = new mongoose.Schema({
    turf: { type: mongoose.Schema.Types.ObjectId, ref: 'Turf', required: true }, // Associated Turf
    name: { type: String, required: true },
    sport: { type: String, required: true },
    days: [{ type: String }], // ['Mon', 'Wed']
    startTime: { type: String, required: true }, // "16:00"
    endTime: { type: String, required: true }, // "18:00"
    price: { type: Number, required: true },
    maxStudents: { type: Number, default: 20 },
    color: { type: String }, // UI Color e.g. "bg-green-100"
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Optional link to staff
}, { timestamps: true });

module.exports = mongoose.model('Batch', BatchSchema);
