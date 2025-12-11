const mongoose = require('mongoose');

const PlayerSchema = new mongoose.Schema({
    team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
    name: { type: String, required: true },
    number: { type: Number },
    position: { type: String } // e.g. Forward, Goalkeeper
}, { timestamps: true });

module.exports = mongoose.model('Player', PlayerSchema);
