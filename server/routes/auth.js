const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Helper: Generate JWT token
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Helper: Sanitize user object for response
const sanitizeUser = (user) => ({
    id: user._id,
    username: user.username,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    progress: user.progress
});

// Check username availability
router.get('/check-username/:username', async (req, res) => {
    try {
        const { username } = req.params;

        // Validate format
        if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
            return res.status(400).json({
                available: false,
                message: 'Username must be 3-20 characters and contain only letters, numbers, and underscores'
            });
        }

        const existingUser = await User.findOne({ username: username.toLowerCase() });

        if (existingUser) {
            return res.json({ available: false, message: 'Username is already taken' });
        }

        res.json({ available: true, message: 'Username is available' });
    } catch (error) {
        res.status(500).json({ available: false, message: 'Server error' });
    }
});

// Register
router.post('/register', async (req, res) => {
    try {
        const { username, name, email, password } = req.body;

        // Validate required fields
        if (!username || !name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Validate username format
        if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
            return res.status(400).json({
                message: 'Username must be 3-20 characters and contain only letters, numbers, and underscores'
            });
        }

        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        // Check if email exists
        const existingEmail = await User.findOne({ email: email.toLowerCase() });
        if (existingEmail) {
            return res.status(400).json({ message: 'Email is already registered' });
        }

        // Check if username exists
        const existingUsername = await User.findOne({ username: username.toLowerCase() });
        if (existingUsername) {
            return res.status(400).json({ message: 'Username is already taken' });
        }

        // Create user
        const user = new User({
            username: username.toLowerCase(),
            name,
            email: email.toLowerCase(),
            password
        });
        await user.save();

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            token,
            user: sanitizeUser(user)
        });
    } catch (error) {
        console.error('Registration error:', error);

        // Handle mongoose validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({ message: messages.join(', ') });
        }

        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Login (email or username)
router.post('/login', async (req, res) => {
    try {
        const { emailOrUsername, password } = req.body;

        if (!emailOrUsername || !password) {
            return res.status(400).json({ message: 'Email/username and password are required' });
        }

        // Find user by email or username
        const user = await User.findOne({
            $or: [
                { email: emailOrUsername.toLowerCase() },
                { username: emailOrUsername.toLowerCase() }
            ]
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check if user has a password (not Google-only)
        if (!user.password) {
            return res.status(400).json({ message: 'Please sign in with Google' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = generateToken(user._id);

        res.json({
            token,
            user: sanitizeUser(user)
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Google OAuth
router.post('/google', async (req, res) => {
    try {
        const { googleId, email, name, avatar } = req.body;

        if (!googleId || !email) {
            return res.status(400).json({ message: 'Google ID and email are required' });
        }

        // Check if user exists by googleId or email
        let user = await User.findOne({
            $or: [{ googleId }, { email: email.toLowerCase() }]
        });

        if (user) {
            // Update googleId if not set (linking existing account)
            if (!user.googleId) {
                user.googleId = googleId;
                if (avatar && !user.avatar) user.avatar = avatar;
                await user.save();
            }
        } else {
            // Create new user with auto-generated username
            const baseUsername = email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '').substring(0, 15);
            let username = baseUsername;
            let counter = 1;

            // Ensure unique username
            while (await User.findOne({ username: username.toLowerCase() })) {
                username = `${baseUsername}${counter}`;
                counter++;
            }

            user = new User({
                username: username.toLowerCase(),
                name: name || email.split('@')[0],
                email: email.toLowerCase(),
                googleId,
                avatar: avatar || ''
            });
            await user.save();
        }

        const token = generateToken(user._id);

        res.json({
            token,
            user: sanitizeUser(user)
        });
    } catch (error) {
        console.error('Google OAuth error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get current user (protected)
router.get('/me', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(sanitizeUser(user));
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
});

module.exports = router;
