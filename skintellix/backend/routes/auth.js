const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// In-memory user store (replace with MongoDB in production)
const users = [];

function generateToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'skintellix_secret_2024', { expiresIn: '7d' });
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, gender } = req.body;
    if (!name || !email || !password) return res.status(400).json({ success: false, error: 'Name, email, password required' });
    if (users.find(u => u.email === email)) return res.status(409).json({ success: false, error: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 12);
    const user = { _id: `user_${Date.now()}`, name, email, password: hashed, phone, gender, createdAt: new Date(), skinProfile: null, wishlist: [], preferences: { budget: 'mid-range' } };
    users.push(user);

    const token = generateToken(user._id);
    const { password: _, ...safeUser } = user;
    res.status(201).json({ success: true, data: { user: safeUser, token } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);
    if (!user) return res.status(401).json({ success: false, error: 'Invalid credentials' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ success: false, error: 'Invalid credentials' });

    const token = generateToken(user._id);
    const { password: _, ...safeUser } = user;
    res.json({ success: true, data: { user: safeUser, token } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/auth/me
router.get('/me', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ success: false, error: 'No token' });
  try {
    const decoded = jwt.verify(auth.replace('Bearer ', ''), process.env.JWT_SECRET || 'skintellix_secret_2024');
    const user = users.find(u => u._id === decoded.id);
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    const { password: _, ...safeUser } = user;
    res.json({ success: true, data: safeUser });
  } catch {
    res.status(401).json({ success: false, error: 'Invalid token' });
  }
});

// PATCH /api/auth/skin-profile
router.patch('/skin-profile', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ success: false, error: 'No token' });
  try {
    const decoded = jwt.verify(auth.replace('Bearer ', ''), process.env.JWT_SECRET || 'skintellix_secret_2024');
    const user = users.find(u => u._id === decoded.id);
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    user.skinProfile = { ...req.body, analyzedAt: new Date() };
    const { password: _, ...safeUser } = user;
    res.json({ success: true, data: safeUser });
  } catch {
    res.status(401).json({ success: false, error: 'Invalid token' });
  }
});

module.exports = router;
