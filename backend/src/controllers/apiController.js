const { createLock, releaseLock } = require('../services/lockService');

exports.createLock = async (req, res) => {
  try {
    const { slotId, ttlMs } = req.body;
    const apiKeyId = req.apiKey && req.apiKey._id;
    if (!slotId) return res.status(400).json({ error: 'slotId required' });
    const lock = await createLock(slotId, apiKeyId, ttlMs || 5 * 60 * 1000);
    if (!lock) return res.status(409).json({ error: 'Slot not available' });
    return res.json(lock);
  } catch (err) {
    console.error('createLock error', err);
    return res.status(500).json({ error: 'internal error' });
  }
};

exports.releaseLock = async (req, res) => {
  try {
    const { lockId } = req.params;
    if (!lockId) return res.status(400).json({ error: 'lockId required' });
    const ok = await releaseLock(lockId);
    if (!ok) return res.status(404).json({ error: 'Lock not found' });
    return res.json({ ok: true });
  } catch (err) {
    console.error('releaseLock error', err);
    return res.status(500).json({ error: 'internal error' });
  }
};
