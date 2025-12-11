const mongoose = require('mongoose');

const MatchSchema = new mongoose.Schema({
    tournament: { type: mongoose.Schema.Types.ObjectId, ref: 'Tournament', required: true },
    round: { type: Number, required: true }, // 1=Quarter, 2=Semi, 3=Final etc.

    team1: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
    team2: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },

    score1: { type: Number, default: null },
    score2: { type: Number, default: null },

    winner: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
    status: { type: String, enum: ['SCHEDULED', 'PENDING', 'ONGOING', 'COMPLETED'], default: 'SCHEDULED' },

    nextMatchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Match' }, // Pointer to next bracket match

    referee: { type: mongoose.Schema.Types.ObjectId, ref: 'Referee' },

    events: [{
        type: { type: String }, // GOAL, CARD, RUN, WICKET
        teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
        playerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
        timestamp: { type: Date },
        value: { type: Number }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Match', MatchSchema);
