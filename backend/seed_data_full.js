const mongoose = require('mongoose');
const { connectDB } = require('./src/config/db');
require('dotenv').config();

// Import Models
const User = require('./src/models/User');
const Turf = require('./src/models/Turf');
const Slot = require('./src/models/Slot');
const Booking = require('./src/models/Booking');
const Expense = require('./src/models/Expense');
const Maintenance = require('./src/models/Maintenance');
const Coupon = require('./src/models/Coupon');
const Tournament = require('./src/models/Tournament');
const Team = require('./src/models/Team');
const Match = require('./src/models/Match');
const Player = require('./src/models/Player');
const Referee = require('./src/models/Referee');
const Batch = require('./src/models/Batch');
const Student = require('./src/models/Student');
const IntegrationLog = require('./src/models/IntegrationLog');

// Helper for dates
const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};

const subDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() - days);
    return result;
};

const today = new Date();
today.setHours(0, 0, 0, 0);

async function seedData() {
    await connectDB();
    console.log('Clearing existing data...');

    // Clear Collections
    await User.deleteMany({});
    await Turf.deleteMany({});
    await Slot.deleteMany({});
    await Booking.deleteMany({});
    await Expense.deleteMany({});
    await Maintenance.deleteMany({});
    await Coupon.deleteMany({});
    await Tournament.deleteMany({});
    await Team.deleteMany({});
    await Match.deleteMany({});
    await Player.deleteMany({});
    await Referee.deleteMany({});
    await Batch.deleteMany({});
    await Student.deleteMany({});
    await IntegrationLog.deleteMany({});

    console.log('Seeding Turfs...');
    const turfDocs = await Turf.insertMany([
        { name: 'Central Arena', location: 'Koramangala, Bangalore', grounds: 3, availableSlots: 145, integrations: 3, status: 'active' },
        { name: 'North Box Cricket', location: 'Indiranagar, Bangalore', grounds: 2, availableSlots: 84, integrations: 1, status: 'active' },
        { name: 'South Football Fields', location: 'Jayanagar, Bangalore', grounds: 4, availableSlots: 120, integrations: 2, status: 'inactive' },
    ]);
    const mainTurf = turfDocs[0]; // Use Central Arena as primary for relations

    console.log('Seeding Users...');
    const userDocs = await User.insertMany([
        { name: 'Ramesh Kumar', email: 'ramesh@turfhub.com', password: 'password123', role: 'manager', status: 'active', turfId: mainTurf._id },
        { name: 'Priya Sharma', email: 'priya@turfhub.com', password: 'password123', role: 'admin', status: 'active', turfId: mainTurf._id },
        { name: 'Suresh Singh', email: 'suresh@turfhub.com', password: 'password123', role: 'staff', status: 'active', turfId: mainTurf._id },
    ]);
    const staffUser = userDocs[2];

    console.log('Seeding Slots & Bookings...');
    // Create slots for today +/- 5 days
    const slotDocs = [];
    for (let i = -5; i <= 5; i++) {
        const day = addDays(today, i);
        // Create 2 morning slots per day
        slotDocs.push({
            turf: mainTurf._id,
            start: new Date(new Date(day).setHours(6, 0)),
            end: new Date(new Date(day).setHours(7, 0)),
            price: 800,
            status: 'BOOKED',
            groundName: 'Cricket Arena A'
        });
        slotDocs.push({
            turf: mainTurf._id,
            start: new Date(new Date(day).setHours(7, 0)),
            end: new Date(new Date(day).setHours(8, 0)),
            price: 1000,
            status: 'AVAILABLE',
            groundName: 'Football Turf 5s'
        });
    }
    const createdSlots = await Slot.insertMany(slotDocs);

    // Create corresponding bookings for BOOKED slots
    const bookedSlots = createdSlots.filter(s => s.status === 'BOOKED');
    const bookings = bookedSlots.map(slot => ({
        turf: mainTurf._id,
        slots: [slot._id],
        user: staffUser._id,
        customerName: 'Morning Club',
        customerPhone: '9876543210',
        amount: slot.price,
        status: 'CONFIRMED',
        platform: 'WALK_IN',
        paymentStatus: 'PAID'
    }));
    const createdBookings = await Booking.insertMany(bookings);

    // Link booking back to slot
    for (let i = 0; i < createdBookings.length; i++) {
        await Slot.findByIdAndUpdate(bookedSlots[i]._id, { booking: createdBookings[i]._id });
    }

    console.log('Seeding Operations...');
    await Expense.insertMany([
        { turf: mainTurf._id, category: 'electricity', description: 'Bill for Nov', amount: 15000, date: subDays(today, 5) },
        { turf: mainTurf._id, category: 'other', description: 'Net Repair', amount: 2500, date: subDays(today, 1) },
    ]);

    await Maintenance.insertMany([
        { turf: mainTurf._id, type: 'cleaning', description: 'Deep Clean', startTime: new Date(), endTime: new Date(new Date().getTime() + 3600000), cost: 500, status: 'scheduled' }
    ]);

    console.log('Seeding Marketing...');
    await Coupon.insertMany([
        { turf: mainTurf._id, code: 'WELCOME50', discountType: 'percentage', discountValue: 50, expiryDate: addDays(today, 30) },
        { turf: mainTurf._id, code: 'FLAT100', discountType: 'flat', discountValue: 100, expiryDate: addDays(today, 15) },
    ]);

    console.log('Seeding Tournaments...');
    const tournament = await Tournament.create({
        name: 'Winter Cup 2024',
        startDate: addDays(today, 10),
        endDate: addDays(today, 12),
        prizePool: 25000,
        entryFee: 1500,
        status: 'UPCOMING'
    });

    const team1 = await Team.create({ tournament: tournament._id, name: 'Spartans FC', captain: 'Rahul', status: 'APPROVED' });
    const team2 = await Team.create({ tournament: tournament._id, name: 'Turf Kings', captain: 'Amit', status: 'APPROVED' });
    await Team.create({ tournament: tournament._id, name: 'Night Owls', captain: 'Vikram', status: 'PENDING' });

    // Matches
    await Match.create({
        tournament: tournament._id,
        round: 1,
        team1: team1._id,
        team2: team2._id,
        status: 'SCHEDULED'
    });

    console.log('Seeding Coaching...');
    const batch = await Batch.create({
        turf: mainTurf._id,
        name: 'U-14 Football Academy',
        sport: 'Football',
        days: ['Mon', 'Wed', 'Fri'],
        startTime: '16:00',
        endTime: '18:00',
        price: 1500,
        instructor: staffUser._id
    });

    await Student.create([
        { batch: batch._id, name: 'Kid One', contact: '1234567890', status: 'PAID' },
        { batch: batch._id, name: 'Kid Two', contact: '0987654321', status: 'DUE' },
    ]);

    console.log('Seeding Completed Successfully!');
    process.exit(0);
}

seedData().catch(err => {
    console.error(err);
    process.exit(1);
});
