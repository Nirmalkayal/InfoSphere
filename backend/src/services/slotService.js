const Slot = require('../models/Slot');

async function createSlotsForTurf(turfId, slots) {
  const docs = slots.map(s => ({ turf: turfId, start: s.start, end: s.end }));
  return Slot.insertMany(docs);
}

async function listSlots(turfId, from, to) {
  return Slot.find({ turf: turfId, start: { $gte: from }, end: { $lte: to } }).sort('start');
}

module.exports = { createSlotsForTurf, listSlots };
