const Tournament = require('../models/Tournament');
const Team = require('../models/Team');
const Match = require('../models/Match');

exports.getTournaments = async (req, res) => {
    try {
        const tournaments = await Tournament.find({});
        res.json(tournaments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createTournament = async (req, res) => {
    try {
        const tournament = await Tournament.create(req.body);
        res.json({ success: true, id: tournament._id });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
