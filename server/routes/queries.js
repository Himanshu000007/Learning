const express = require('express');
const Query = require('../models/Query');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Auth middleware
const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'No token provided' });
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        const user = await User.findById(decoded.id);
        req.userRole = user?.role;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

// Create query (User)
router.post('/', auth, async (req, res) => {
    try {
        const { subject, message, category } = req.body;
        const query = new Query({
            user: req.userId,
            subject,
            message,
            category: category || 'general'
        });
        await query.save();
        res.status(201).json(query);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get user's queries
router.get('/my', auth, async (req, res) => {
    try {
        const queries = await Query.find({ user: req.userId })
            .sort({ createdAt: -1 });
        res.json(queries);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get all queries (Admin)
router.get('/all', auth, async (req, res) => {
    try {
        if (req.userRole !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }
        const queries = await Query.find()
            .populate('user', 'name email')
            .populate('reply.repliedBy', 'name')
            .sort({ createdAt: -1 });
        res.json(queries);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Reply to query (Admin)
router.put('/:id/reply', auth, async (req, res) => {
    try {
        console.log('Reply request received for:', req.params.id);
        console.log('User Role:', req.userRole);

        if (req.userRole !== 'admin') {
            console.log('Access denied: not admin');
            return res.status(403).json({ message: 'Admin access required' });
        }
        const { message } = req.body;
        console.log('Message:', message);

        const query = await Query.findByIdAndUpdate(
            req.params.id,
            {
                status: 'replied',
                reply: {
                    message,
                    repliedAt: new Date(),
                    repliedBy: req.userId
                }
            },
            { new: true }
        ).populate('user', 'name email');

        console.log('Query updated:', query ? 'success' : 'not found');
        res.json(query);
    } catch (error) {
        console.error('Reply error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Close query
router.put('/:id/close', auth, async (req, res) => {
    try {
        const query = await Query.findByIdAndUpdate(
            req.params.id,
            { status: 'closed' },
            { new: true }
        );
        res.json(query);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
