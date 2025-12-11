const Slot = require('../models/Slot');
const Booking = require('../models/Booking');

exports.getSlots = async (req, res) => {
    try {
        const slots = await Slot.find({}).populate('booking');
        res.json(slots);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.lockSlot = async (req, res) => {
    try {
        const { slotId } = req.params;
        const { platform } = req.body;

        const slot = await Slot.findById(slotId);
        if (!slot) return res.status(404).json({ message: 'Slot not found' });

        if (slot.status === 'BOOKED') return res.status(400).json({ message: 'Slot already booked' });
        if (slot.status === 'LOCKED' && slot.lockedBy !== platform) {
            // Check expiry
            if (new Date() < new Date(slot.lockExpiresAt)) {
                return res.status(400).json({ message: 'Slot locked by another platform' });
            }
        }

        slot.status = 'LOCKED';
        slot.lockedBy = platform;
        slot.lockedAt = new Date();
        slot.lockExpiresAt = new Date(Date.now() + 10 * 60000); // 10 mins
        await slot.save();

        res.json({ success: true, expiresAt: slot.lockExpiresAt });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.bookSlot = async (req, res) => {
    try {
        const { slotId, customerName, amount, platform } = req.body;

        const slot = await Slot.findById(slotId);
        if (!slot) return res.status(404).json({ message: 'Slot not found' });

        // Create Booking
        const booking = await Booking.create({
            turf: slot.turf,
            slots: [slot._id],
            customerName,
            amount,
            platform,
            status: 'CONFIRMED'
        });

        // Update Slot
        slot.status = 'BOOKED';
        slot.booking = booking._id;
        slot.lockedBy = null;
        await slot.save();

        res.json({ success: true, bookingId: booking._id });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
