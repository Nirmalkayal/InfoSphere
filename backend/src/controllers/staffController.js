const Shift = require('../models/Shift');
const User = require('../models/User');

// Admin: Assign a shift
exports.createShift = async (req, res) => {
    try {
        const { userId, start, end, notes } = req.body;
        const shift = await Shift.create({
            user: userId,
            turf: req.user.turfId,
            start,
            end,
            notes,
            status: 'scheduled'
        });
        res.json(shift);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create shift' });
    }
};

// List shifts (with filters)
exports.listShifts = async (req, res) => {
    try {
        const { date, userId } = req.query;
        let query = {};

        // Date filter (specific day)
        if (date) {
            const d = new Date(date);
            const nextDay = new Date(d);
            nextDay.setDate(d.getDate() + 1);
            query.start = { $gte: d, $lt: nextDay };
        }

        if (userId) {
            query.user = userId;
        }

        const shifts = await Shift.find(query).populate('user', 'name role email').sort({ start: 1 });
        res.json(shifts);
    } catch (err) {
        res.status(500).json({ error: 'Failed to list shifts' });
    }
};

// Staff: Check In
exports.checkIn = async (req, res) => {
    try {
        const { shiftId } = req.body;
        const shift = await Shift.findOne({ _id: shiftId, user: req.user.id });

        if (!shift) return res.status(404).json({ error: 'Shift not found or unauthorized' });

        shift.checkIn = new Date();
        shift.status = 'present'; // Can add logic for 'late' if checkIn > start
        await shift.save();

        res.json(shift);
    } catch (err) {
        res.status(500).json({ error: 'Check-in failed' });
    }
};

// Staff: Check Out
exports.checkOut = async (req, res) => {
    try {
        const { shiftId } = req.body;
        const shift = await Shift.findOne({ _id: shiftId, user: req.user.id });

        if (!shift) return res.status(404).json({ error: 'Shift not found' });

        shift.checkOut = new Date();
        await shift.save();

        res.json(shift);
    } catch (err) {
        res.status(500).json({ error: 'Check-out failed' });
    }
};

// Get all staff users
exports.listStaffUsers = async (req, res) => {
    try {
        const users = await User.find({ role: { $ne: 'admin' } }).select('name email role');
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'Failed' });
    }
};
