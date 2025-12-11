const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
    tournament: { type: mongoose.Schema.Types.ObjectId, ref: 'Tournament', required: true },
    name: { type: String, required: true },
    captain: { type: String, required: true }, // Name of captain
    contact: { type: String },
    status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' },
    icon: { type: String, default: 'Users' },
    players: [{ type: String }] // List of player names
}, { timestamps: true });

module.exports = mongoose.model('Team', TeamSchema);
