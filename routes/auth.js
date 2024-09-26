const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const uuid = require('uuid').v4;
const db = require('../config/database');
const { body, validationResult } = require('express-validator');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_default_jwt_secret';

// Middleware to protect routes
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
    console.log(token)
    if (!token) return res.sendStatus(401); // Unauthorized

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // Forbidden
        req.user = user;
        next();
    });
};

// Signup
router.post('/signup', [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const id = uuid();

    db.run('INSERT INTO user (id, name, email, password) VALUES (?, ?, ?, ?)', [id, name, email, hashedPassword], function (err) {
        if (err) return res.status(400).json({ error: err.message });
        res.status(201).json({ id, name, email });
    });
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    db.get('SELECT * FROM user WHERE email = ?', [email], async (err, user) => {
        if (err || !user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
    });
});

// Add Todo
router.post('/todos', authenticateToken, (req, res) => {
    const { title, status } = req.body;
    const userId = req.user.id; // Get user ID from token

    db.run('INSERT INTO todos (title, status, userId) VALUES (?, ?, ?)', [title, status, userId], function (err) {
        if (err) return res.status(400).json({ error: err.message });
        res.status(201).json({ id: this.lastID, title, status });
    });
});

// Example of a protected route
router.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: 'This is a protected route', user: req.user });
});

module.exports = router;