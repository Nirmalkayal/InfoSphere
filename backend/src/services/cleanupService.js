const Lock = require('../models/Lock');

async function cleanupExpiredLocks() {
  const now = new Date();
  const expired = await Lock.find({ expiresAt: { $lte: now } });
  for (const l of expired) {
    await l.remove();
  }
  return expired.length;
}

module.exports = { cleanupExpiredLocks };
