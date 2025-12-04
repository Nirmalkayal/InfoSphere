const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');

module.exports = function (req, res, next) {
  if (process.env.DISABLE_AUTH === 'true') return next();
  const auth = req.header('authorization');
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing token' });
  const token = auth.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET || process.env.JWT_SECRET || 'replace-me');
    req.user = payload;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
