const bcrypt = require('bcrypt');
const jwt    = require('jsonwebtoken');
const { db } = require('../config/db');

const SALT_ROUNDS = 12;

exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password)
    return res.status(400).json({ error: 'username, email and password are required' });

  try {
    const existing = db.prepare(
      'SELECT id FROM users WHERE email = ? OR username = ?'
    ).get(email, username);
    if (existing)
      return res.status(409).json({ error: 'Username or email already exists' });

    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
    const info = db.prepare(
      `INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, 'user')`
    ).run(username, email, password_hash);

    const user = db.prepare('SELECT id, username, email, role, created_at FROM users WHERE id = ?')
                   .get(info.lastInsertRowid);

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
    res.status(201).json({ user, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'email and password are required' });

  try {
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
    const { password_hash, ...safeUser } = user;
    res.json({ user: safeUser, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.me = async (req, res) => {
  try {
    const user = db.prepare(
      'SELECT id, username, email, role, created_at FROM users WHERE id = ?'
    ).get(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
