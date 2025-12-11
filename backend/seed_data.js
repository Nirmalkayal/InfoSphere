const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Turf = require('./src/models/Turf');
const Slot = require('./src/models/Slot');
const ApiKey = require('./src/models/ApiKey');
const User = require('./src/models/User');
const Booking = require('./src/models/Booking');
const IntegrationLog = require('./src/models/IntegrationLog');

dotenv.config({ path: path.join(__dirname, '.env') });

/**
 * Generate slots for a turf over several days with a mix of statuses so
 * the calendar looks populated (booked/available/locked).
 */
async function generateSlotsAndBookings(turf) {
    const slotsPerDay = [];
    const today = new Date();

    for (let dayOffset = 0; dayOffset < 5; dayOffset++) {
        for (let hour = 6; hour <= 22; hour += 2) {
            const start = new Date(today);
            start.setDate(today.getDate() + dayOffset);
            start.setHours(hour, 0, 0, 0);
            const end = new Date(start);
            end.setHours(start.getHours() + 2);

            // Rotate statuses to keep the grid interesting
            const cycle = ['booked', 'available', 'available', 'locked'];
            const status = cycle[(dayOffset + hour) % cycle.length];
            const groundName = `Ground ${((hour / 2) % (turf.grounds || 1)) + 1}`;

            const slot = await Slot.create({
                turf: turf._id,
                start,
                end,
                status,
                groundName,
                customerName: status === 'booked' ? 'Walk-in Customer' : undefined,
                platform: status === 'booked' ? 'App' : undefined
            });

            // Create a booking for booked slots so metrics/logs have data
            if (status === 'booked') {
                const booking = await Booking.create({
                    turf: turf._id,
                    slots: [slot._id],
                    amount: 1500,
                    status: 'confirmed',
                    paymentStatus: 'paid',
                    paymentSource: 'online',
                    customerName: 'Walk-in Customer',
                    customerPhone: '+91-9876543210'
                });
                slot.booking = booking._id;
                await slot.save();
            }

            slotsPerDay.push(slot);
        }
    }

    return slotsPerDay;
}

async function seed() {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/turf_locks');
    console.log('Connected to DB');

    // Clean previous demo data
    await Promise.all([
        Turf.deleteMany({}),
        Slot.deleteMany({}),
        ApiKey.deleteMany({}),
        User.deleteMany({}),
        Booking.deleteMany({}),
        IntegrationLog.deleteMany({})
    ]);

    // Seed users
    const adminUser = await User.create({
        name: 'Super Admin',
        email: 'admin@turfhub.com',
        password: 'secret',
        role: 'admin',
        status: 'active',
        lastActiveAt: new Date()
    });
    const managerUser = await User.create({
        name: 'Operations Manager',
        email: 'manager@turfhub.com',
        password: 'secret',
        role: 'manager',
        status: 'active',
        lastActiveAt: new Date(Date.now() - 1000 * 60 * 45)
    });
    const staffUser = await User.create({
        name: 'Front Desk',
        email: 'staff@turfhub.com',
        password: 'secret',
        role: 'staff',
        status: 'active',
        lastActiveAt: new Date(Date.now() - 1000 * 60 * 90)
    });
    console.log('Seeded users:', [adminUser.email, managerUser.email, staffUser.email]);

    // Seed turfs
    const turfs = await Turf.create([
        { name: 'Koramangala Turf Park', location: 'Bangalore, India', grounds: 3, status: 'active', integrations: 3 },
        { name: 'Indiranagar Box Cricket', location: 'Bangalore, India', grounds: 2, status: 'active', integrations: 2 },
        { name: 'HSR Football Arena', location: 'Bangalore, India', grounds: 4, status: 'inactive', integrations: 1 }
    ]);
    console.log('Seeded turfs:', turfs.map(t => t.name).join(', '));

    // Slots and bookings per turf
    for (const turf of turfs) {
        const slots = await generateSlotsAndBookings(turf);
        console.log(`Created ${slots.length} slots for ${turf.name}`);
    }

    // API Keys for integrations
    await ApiKey.create([
        { key: 'playo_secret_key_123', name: 'Playo Integration', platform: 'Playo', webhookUrl: 'http://localhost:9999/webhook', rateLimitPerHour: 1000 },
        { key: 'sportify_live_key_456', name: 'Sportify Pro', platform: 'Sportify', webhookUrl: 'http://localhost:9998/webhook', rateLimitPerHour: 2000 },
        { key: 'internal_key_demo', name: 'Internal App', platform: 'Internal', webhookUrl: 'http://localhost:9997/webhook', rateLimitPerHour: 5000 }
    ]);
    console.log('Seeded API keys for Playo/Sportify/Internal');

    // Integration logs to make analytics and tables feel live
    const now = new Date();
    const logs = [];
    for (let i = 0; i < 40; i++) {
        logs.push({
            platform: i % 3 === 0 ? 'Playo' : i % 3 === 1 ? 'Sportify' : 'Internal',
            endpoint: i % 4 === 0 ? '/slots/book' : i % 4 === 1 ? '/slots/check' : '/webhooks/payment',
            method: i % 4 === 0 ? 'POST' : 'GET',
            status: i % 7 === 0 ? 'failed' : 'success',
            responseTimeMs: 80 + (i * 3) % 50,
            occurredAt: new Date(now.getTime() - i * 5 * 60 * 1000),
            dataRequested: i % 4 === 0 ? '{ "slotId": "demo-slot" }' : '{ "date": "today" }'
        });
    }
    await IntegrationLog.insertMany(logs);
    console.log('Inserted integration logs:', logs.length);

    console.log('Demo data seeded successfully.');
    process.exit(0);
}

seed().catch(err => {
    console.error(err);
    process.exit(1);
});

