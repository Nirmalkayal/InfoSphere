const Slot = require('../models/Slot');
const Booking = require('../models/Booking');
const Expense = require('../models/Expense');
const mongoose = require('mongoose');

exports.getDashboardData = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // 1. Revenue (Sum of confirmed bookings)
        const totalRevenue = await Booking.aggregate([
            { $match: { status: 'CONFIRMED' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        const revenue = totalRevenue[0]?.total || 0;

        // 2. Expenses
        const totalExpenses = await Expense.aggregate([
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const expenses = totalExpenses[0]?.total || 0;

        // 3. Bookings Count
        const bookingsCount = await Booking.countDocuments({ status: 'CONFIRMED' });

        // 4. Revenue Chart (Last 7 days)
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

        const revenueChart = await Booking.aggregate([
            { $match: { status: 'CONFIRMED', createdAt: { $gte: sevenDaysAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    revenue: { $sum: "$amount" }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // 5. Peak Hours (Aggregate from Slots)
        const slots = await Slot.find({ status: 'BOOKED' });
        const hoursMap = {};
        slots.forEach(slot => {
            const hour = new Date(slot.start).getHours();
            hoursMap[hour] = (hoursMap[hour] || 0) + 1;
        });
        const peakHours = Object.entries(hoursMap).map(([hour, count]) => ({ hour: parseInt(hour), count }));

        // 6. Top Customer
        const topCustomer = await Booking.aggregate([
            { $match: { status: 'CONFIRMED' } },
            {
                $group: {
                    _id: "$customerName",
                    totalSpent: { $sum: "$amount" },
                    bookings: { $sum: 1 }
                }
            },
            { $sort: { totalSpent: -1 } },
            { $limit: 1 }
        ]);

        res.json({
            stats: {
                revenue,
                expenses,
                profit: revenue - expenses,
                bookings: bookingsCount
            },
            revenueChart,
            peakHours,
            topCustomer: topCustomer[0] || null
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};
