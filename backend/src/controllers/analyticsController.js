const Booking = require('../models/Booking');
const Slot = require('../models/Slot');
const Expense = require('../models/Expense');

exports.getAnalytics = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // 1. Headline Stats
        const totalRevenueAgg = await Booking.aggregate([
            { $match: { paymentStatus: 'paid' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const totalExpensesAgg = await Expense.aggregate([
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        // 2. Revenue Chart (Last 7 Days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const revenueChart = await Booking.aggregate([
            {
                $match: {
                    paymentStatus: 'paid',
                    createdAt: { $gte: sevenDaysAgo }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    revenue: { $sum: "$amount" }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // 3. Peak Hours (Analyze past bookings)
        const peakHours = await Slot.aggregate([
            { $match: { status: 'booked' } },
            { $project: { hour: { $hour: "$start" } } },
            { $group: { _id: "$hour", count: { $sum: 1 } } },
            { $sort: { "_id": 1 } }
        ]);

        // 4. Platform Distribution
        const platformDist = await Slot.aggregate([
            { $match: { status: 'booked' } },
            { $group: { _id: "$platform", count: { $sum: 1 } } }
        ]);

        res.json({
            stats: {
                revenue: totalRevenueAgg[0]?.total || 0,
                expenses: totalExpensesAgg[0]?.total || 0,
                profit: (totalRevenueAgg[0]?.total || 0) - (totalExpensesAgg[0]?.total || 0),
                bookings: await Booking.countDocuments()
            },
            revenueChart,
            peakHours: peakHours.map(p => ({ hour: p._id, count: p.count })),
            platforms: platformDist.map(p => ({ name: p._id || 'internal', value: p.count }))
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Analytics failed' });
    }
};
