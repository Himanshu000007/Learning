const express = require('express');
const User = require('../models/User');
const Course = require('../models/Course');
const Query = require('../models/Query');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Admin auth middleware
const adminAuth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'No token provided' });
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (user?.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }
        req.userId = decoded.id;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

// Get dashboard stats
router.get('/stats', adminAuth, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalCourses = await Course.countDocuments();
        const totalQueries = await Query.countDocuments();
        const pendingQueries = await Query.countDocuments({ status: 'pending' });

        res.json({
            totalUsers,
            totalCourses,
            totalQueries,
            pendingQueries
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get all users with enrollments
router.get('/users', adminAuth, async (req, res) => {
    try {
        const users = await User.find()
            .select('-password')
            .populate('enrolledCourses', 'title category')
            .populate('completedCourses', 'title category')
            .sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get course enrollments
router.get('/enrollments', adminAuth, async (req, res) => {
    try {
        const courses = await Course.find().select('title category enrolledCount');
        const users = await User.find()
            .select('name email enrolledCourses')
            .populate('enrolledCourses', 'title');

        // Build enrollment data
        const enrollments = users.filter(u => u.enrolledCourses?.length > 0).map(user => ({
            userName: user.name,
            userEmail: user.email,
            courses: user.enrolledCourses.map(c => c.title)
        }));

        res.json({ courses, enrollments });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Make user admin
router.put('/make-admin/:userId', adminAuth, async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.userId,
            { role: 'admin' },
            { new: true }
        ).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
