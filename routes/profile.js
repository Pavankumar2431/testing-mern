// server/routes/profile.js
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../config/database');
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_default_jwt_secret';

// Middleware to authenticate JWT
const authenticateToken  = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.sendStatus(403);
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Get User Profile
router.get('/', authenticateToken , (req, res) => {
  db.get('SELECT id, name, email FROM user WHERE id = ?', [req.user.id], (err, user) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json(user);
  });
});

// Update User Profile
router.put('/', authenticateToken , async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
  db.run('UPDATE user SET name = ?, email = ?, password = ? WHERE id = ?', [name, email, hashedPassword, req.user.id], function (err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ id: req.user.id, name, email });
  });
});

module.exports = router;