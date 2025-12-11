const cron = require('node-cron');
const { cleanupExpiredLocks } = require('../controllers/externalController');

// Run every minute
const initCronJobs = () => {
    cron.schedule('* * * * *', async () => {
        console.log('Running Cron: Cleanup Expired Locks');
        await cleanupExpiredLocks();
    });
};

module.exports = { initCronJobs };
