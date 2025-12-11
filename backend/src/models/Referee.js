const mongoose = require('mongoose');

const RefereeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    certification: { type: String }, // e.g. ICC Elite, FIFA Pro
    matches: { type: Number, default: 0 },
    rating: { type: Number, default: 5.0 },
    avatar: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Referee', RefereeSchema);
