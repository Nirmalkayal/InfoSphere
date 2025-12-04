const Lock = require('../models/Lock');
const Slot = require('../models/Slot');
const mongoose = require('mongoose');

async function createLock(slotId, apiKeyId, ttlMs) {
  const expiresAt = new Date(Date.now() + ttlMs);

  const slot = await Slot.findOneAndUpdate(
    { _id: slotId, status: 'available' },
    { $set: { status: 'locked' } },
    { new: true }
  );

  if (!slot) return null;

  const lock = await Lock.create({ slot: slot._id, apiKey: apiKeyId, expiresAt });
  return lock;
}

async function releaseLock(lockId) {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const lock = await Lock.findById(lockId).session(session);
    if (!lock) {
      await session.abortTransaction();
      session.endSession();
      return null;
    }
    await Slot.findByIdAndUpdate(lock.slot, { status: 'available' }).session(session);
    await Lock.deleteOne({ _id: lock._id }).session(session);
    await session.commitTransaction();
    session.endSession();
    return true;
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
}

module.exports = { createLock, releaseLock };
