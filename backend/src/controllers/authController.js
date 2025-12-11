const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');

const User = require('../models/User');

exports.login = async (req, res) => {
  const { email, username, password } = req.body || {};
  const userIdentifier = email || username;

  if (!userIdentifier || !password) {
    console.log('Login failed: Missing credentials', req.body);
    return res.status(400).json({ error: 'email/username and password required' });
  }

  try {
    console.log(`Login attempt for: ${userIdentifier}`);
    const user = await User.findOne({ email: userIdentifier });
    console.log('User found:', user ? user.email : 'NULL');

    if (!user || user.password !== password) {
      console.log('Login failed: Invalid credentials or password mismatch');
      return res.status(401).json({ error: 'invalid credentials' });
    }

    // Include role, id, and turfId in token
    const payload = {
      sub: user.email,
      id: user._id,
      role: user.role,
      turfId: user.turfId
    };

    const token = jwt.sign(payload, JWT_SECRET || 'replace-me', { expiresIn: '8h' });

    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        turfId: user.turfId
      }
    });
  } catch (err) {
    console.error('Login error', err);
    return res.status(500).json({ error: 'internal error' });
  }
};
