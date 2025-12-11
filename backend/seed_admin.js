const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

async function seedAdmin() {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/turf_locks');
    console.log('Connected to DB');

    await User.deleteMany({ email: 'admin@turfhub.com' });

    const admin = await User.create({
        name: 'Super Admin',
        email: 'admin@turfhub.com',
        password: 'secret', // Plain text for now as per plan
        role: 'admin',
        status: 'active'
    });

    console.log('Created Admin:', admin.email);
    process.exit(0);
}

seedAdmin().catch(err => {
    console.error(err);
    process.exit(1);
});
