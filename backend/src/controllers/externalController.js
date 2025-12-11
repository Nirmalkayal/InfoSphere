const Slot = require('../models/Slot');
const Booking = require('../models/Booking');

// The "Traffic Cop" Controller
exports.handleSlotLock = async (req, res) => {
    try {
        const { slotId, platform } = req.body;

        // 1. Find Slot
        const slot = await Slot.findById(slotId);
        if (!slot) return res.status(404).json({ error: "Slot not found" });

        // 2. Check Status
        const now = new Date();

        // If Booked -> Reject
        if (slot.status === 'BOOKED') {
            return res.status(409).json({ error: "Sold Out", code: "SLOT_BOOKED" });
        }

        // If Locked by someone else (and not expired) -> Reject
        if (slot.status === 'LOCKED' && slot.lockExpiresAt > now && slot.lockedBy !== platform) {
            return res.status(409).json({ error: "Slot is currently being booked", code: "SLOT_LOCKED" });
        }

        // 3. Apply Lock (Handshake)
        slot.status = 'LOCKED';
        slot.lockedBy = platform; // e.g., "PLAYO"
        slot.lockedAt = now;
        slot.lockExpiresAt = new Date(now.getTime() + 10 * 60000); // +10 Minutes

        await slot.save();

        // Notify Admin Dashboard (via Socket) - Concept
        // io.emit('slot_update', slot);

        return res.json({
            success: true,
            message: "Lock Granted",
            expiresAt: slot.lockExpiresAt
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Locking failed" });
    }
};

exports.handlePaymentWebhook = async (req, res) => {
    try {
        const { slotId, externalBookingId, amount, customerName, platform } = req.body;

        // 1. Find Slot
        const slot = await Slot.findById(slotId);
        if (!slot) return res.status(404).json({ error: "Slot not found" });

        // 2. Confirm Booking
        slot.status = 'BOOKED';
        slot.lockedBy = null;
        slot.lockedAt = null;
        slot.lockExpiresAt = null;
        await slot.save();

        // 3. Create Receipt
        const booking = new Booking({
            turf: slot.turf,
            slots: [slot._id],
            customerName,
            amount,
            status: 'CONFIRMED',
            paymentStatus: 'PAID',
            platform: platform || 'EXTERNAL',
            externalReferenceId: externalBookingId
        });
        await booking.save();

        // Notify Admin
        // io.emit('new_booking', booking);

        return res.json({ success: true, bookingId: booking._id });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Webhook processing failed" });
    }
};

// --- CRON JOB (Conceptual Helper) ---
exports.cleanupExpiredLocks = async () => {
    const now = new Date();
    // Release locks that have expired
    const result = await Slot.updateMany(
        { status: 'LOCKED', lockExpiresAt: { $lt: now } },
        {
            $set: {
                status: 'AVAILABLE',
                lockedBy: null,
                lockedAt: null,
                lockExpiresAt: null
            }
        }
    );
    if (result.modifiedCount > 0) {
        console.log(`🧹 Released ${result.modifiedCount} expired locks.`);
    }
};
