const { cleanupExpiredLocks } = require('../services/cleanupService');

async function runCron() {
  try {
    const removed = await cleanupExpiredLocks();
    if (removed) console.log(`Cleaned ${removed} expired locks`);
  } catch (err) {
    console.error('Cron error', err);
  }
}

setInterval(runCron, 60 * 1000);

module.exports = { runCron };
