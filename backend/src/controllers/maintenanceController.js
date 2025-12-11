const Maintenance = require('../models/Maintenance');
const Slot = require('../models/Slot');
const { broadcast } = require('../services/webhookService');

exports.scheduleMaintenance = async (req, res) => {
    const { type, description, startTime, endTime, cost, performedBy } = req.body;

    if (!startTime || !endTime) {
        return res.status(400).json({ error: 'Start and End time required' });
    }

    try {
        const start = new Date(startTime);
        const end = new Date(endTime);

        // 1. Create Maintenance Record
        const maintenance = await Maintenance.create({
            turf: req.user.turfId || '65c27a29f8d9a8c123456789',
            type,
            description,
            startTime: start,
            endTime: end,
            cost,
            performedBy,
            createdBy: req.user.id
        });

        // 2. Block Slots in this range
        // Find all slots that overlap with this maintenance window
        // Logic: Slot Start < Maintenance End AND Slot End > Maintenance Start
        const slotsToBlock = await Slot.find({
            start: { $lt: end },
            end: { $gt: start }
        });

        const slotIds = slotsToBlock.map(s => s._id);

        // Update them to 'maintenance' status (or blocked)
        await Slot.updateMany(
            { _id: { $in: slotIds } },
            {
                $set: {
                    status: 'blocked',
                    customerName: `Maintenance: ${type}`,
                    platform: 'internal'
                }
            }
        );

        // 3. Broadcast changes
        slotIds.forEach(id => {
            broadcast('SLOT_LOCKED', {
                slotId: id,
                status: 'blocked',
                customerName: `Maintenance: ${type}`
            });
        });

        res.json(maintenance);
    } catch (err) {
        console.error('Maintenance scheduling failed', err);
        res.status(500).json({ error: 'Internal error' });
    }
};

exports.listMaintenance = async (req, res) => {
    try {
        const records = await Maintenance.find().sort({ startTime: -1 });
        res.json(records);
    } catch (err) {
        res.status(500).json({ error: 'Failed to list maintenance' });
    }
};
