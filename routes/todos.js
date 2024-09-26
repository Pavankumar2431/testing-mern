// server/routes/todos.js
const express = require('express');
const jwt = require('jsonwebtoken');
const uuid = require('uuid').v4;
const db = require('../config/database');
const router = express.Router();
const JWT_SECRET =process.env.JWT_SECRET || 'your_default_jwt_secret';

// Middleware to authenticate JWT
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Extract token from Bearer token format
    if (!token) {
        console.log('No token provided');
        return res.sendStatus(403); // Forbidden
    }
    
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            console.log('Token verification failed:', err.message);
            return res.sendStatus(403); // Forbidden
        }
        
        console.log('User from token:', user); // Log user info from token
        req.user = user; // Attach user info to the request object
        next();
    });
};


// Create Todo
router.post('/', authenticateToken, (req, res) => {
    const { title, status } = req.body;
    const userId = req.user.id; // Get user ID from token

    if (!userId) {
        return res.status(403).json({ error: 'User ID not found in token' });
    }

    db.run('INSERT INTO todo (title, status, userId) VALUES (?, ?, ?)', [title, status, userId], function (err) {
        if (err) {
            console.error('Database error:', err);
            return res.status(400).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID, title, status });
    });
});


// Get Todos
router.get('/', authenticateToken , (req, res) => {
  db.all('SELECT * FROM todo WHERE userId = ?', [req.user.id], (err, todos) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json(todos);
  });
});

// Update Todo
router.put('/:id', authenticateToken , (req, res) => {
  const { title, status } = req.body;
  db.run('UPDATE todo SET title = ?, status = ? WHERE id = ? AND userId = ?', [title, status, req.params.id, req.user.id], function (err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ id: req.params.id, title, status });
  });
});

// Delete Todo
router.delete('/:id', authenticateToken , (req, res) => {
  db.run('DELETE FROM todo WHERE id = ? AND userId = ?', [req.params.id, req.user.id], function (err) {
    if (err) return res.status(400).json({ error: err.message });
    res.sendStatus(204);
  });
});

module.exports = router;