const mongoose = require('mongoose');

const TournamentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, enum: ['KNOCKOUT', 'LEAGUE'], default: 'KNOCKOUT' },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    prizePool: { type: Number, default: 0 },
    entryFee: { type: Number, default: 0 },
    status: { type: String, enum: ['UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED'], default: 'UPCOMING' },
    maxTeams: { type: Number, default: 8 },
    registeredTeams: { type: Number, default: 0 },

    // Auto-Block Schedule Config
    scheduleConfig: {
        groundIds: [{ type: String }], // 'all' or specific IDs
        startTime: { type: String }, // "18:00"
        endTime: { type: String }    // "22:00"
    }
}, { timestamps: true });

module.exports = mongoose.model('Tournament', TournamentSchema);
