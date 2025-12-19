const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Middleware to verify token
const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

// Get user profile
router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.userId)
            .select('-password')
            .populate('enrolledCourses')
            .populate('completedCourses');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update user progress
router.put('/progress', auth, async (req, res) => {
    try {
        const { hoursLearned, coursesCompleted, currentStreak, skillScore } = req.body;
        const user = await User.findByIdAndUpdate(
            req.userId,
            {
                progress: { hoursLearned, coursesCompleted, currentStreak, skillScore }
            },
            { new: true }
        ).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Enroll in course
router.post('/enroll/:courseId', auth, async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.userId,
            { $addToSet: { enrolledCourses: req.params.courseId } },
            { new: true }
        ).populate('enrolledCourses');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get all users (Admin)
router.get('/', async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
