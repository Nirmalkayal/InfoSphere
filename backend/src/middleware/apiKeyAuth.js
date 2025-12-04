const ApiKey = require('../models/ApiKey');

module.exports = async function (req, res, next) {
  try {
    const key = req.header('x-api-key');
    if (!key) return res.status(401).json({ error: 'Missing API key' });
    const apiKey = await ApiKey.findOne({ key, revoked: false });
    if (!apiKey) return res.status(403).json({ error: 'Invalid API key' });
    req.apiKey = apiKey;
    next();
  } catch (err) {
    return res.status(503).json({ error: 'Service unavailable' });
  }
};
