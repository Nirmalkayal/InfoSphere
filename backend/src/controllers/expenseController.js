const Expense = require('../models/Expense');
const Booking = require('../models/Booking');

exports.addExpense = async (req, res) => {
    try {
        const expense = await Expense.create({
            ...req.body,
            turf: req.user.turfId || '65c27a29f8d9a8c123456789',
            createdBy: req.user.id
        });
        res.json(expense);
    } catch (err) {
        res.status(500).json({ error: 'Failed to add expense' });
    }
};

exports.listExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find().sort({ date: -1 });
        res.json(expenses);
    } catch (err) {
        res.status(500).json({ error: 'Failed to list expenses' });
    }
};

exports.getFinancialSummary = async (req, res) => {
    try {
        // 1. Total Revenue (from Confirmed Bookings)
        // In a real app, perform Aggregation on Booking collection
        const revenueAgg = await Booking.aggregate([
            { $match: { paymentStatus: 'paid' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const totalRevenue = revenueAgg[0]?.total || 0;

        // 2. Total Expenses
        const expenseAgg = await Expense.aggregate([
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const totalExpenses = expenseAgg[0]?.total || 0;

        // 3. Category Breakdown
        const byCategory = await Expense.aggregate([
            { $group: { _id: '$category', total: { $sum: '$amount' } } }
        ]);

        res.json({
            revenue: totalRevenue,
            expenses: totalExpenses,
            profit: totalRevenue - totalExpenses,
            breakdown: byCategory
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to get summary' });
    }
};
exports.getShiftStats = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Calculate confirmed bookings today
        const stats = await Booking.aggregate([
            {
                $match: {
                    createdAt: { $gte: today },
                    status: 'CONFIRMED'
                }
            },
            {
                $group: {
                    _id: null,
                    cashCollected: {
                        $sum: { $cond: [{ $eq: ["$paymentSource", "CASH"] }, "$amount", 0] }
                    },
                    onlineCollected: {
                        $sum: { $cond: [{ $in: ["$paymentSource", ["ONLINE", "UPI"]] }, "$amount", 0] }
                    },
                    totalRevenue: { $sum: "$amount" },
                    bookingsCount: { $sum: 1 }
                }
            }
        ]);

        const result = stats[0] || { cashCollected: 0, onlineCollected: 0, totalRevenue: 0, bookingsCount: 0 };
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: 'Failed' });
    }
};

exports.closeShift = async (req, res) => {
    const { cashInHand, notes } = req.body;
    // Log this closure (For now just return success, later save to ShiftClosure model)
    console.log(`Shift Closed. Cash: ${cashInHand}, Notes: ${notes}`);
    res.json({ success: true, timestamp: new Date() });
};
