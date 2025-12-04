const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');

exports.login = async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'username and password required' });

  const adminUser = process.env.ADMIN_USER || 'admin';
  const adminPass = process.env.ADMIN_PASS || 'password';

  if (username !== adminUser || password !== adminPass) {
    return res.status(401).json({ error: 'invalid credentials' });
  }

  const token = jwt.sign({ sub: username }, JWT_SECRET || 'replace-me', { expiresIn: '8h' });
  return res.json({ token });
};
