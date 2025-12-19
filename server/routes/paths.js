const express = require('express');
const LearningPath = require('../models/LearningPath');
const router = express.Router();

// Get all learning paths
router.get('/', async (req, res) => {
    try {
        const paths = await LearningPath.find().populate('nodes.courseId');
        res.json(paths);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get single path
router.get('/:id', async (req, res) => {
    try {
        const path = await LearningPath.findById(req.params.id).populate('nodes.courseId');
        if (!path) {
            return res.status(404).json({ message: 'Learning path not found' });
        }
        res.json(path);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Create learning path
router.post('/', async (req, res) => {
    try {
        const path = new LearningPath(req.body);
        await path.save();
        res.status(201).json(path);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update path
router.put('/:id', async (req, res) => {
    try {
        const path = await LearningPath.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(path);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Delete path
router.delete('/:id', async (req, res) => {
    try {
        await LearningPath.findByIdAndDelete(req.params.id);
        res.json({ message: 'Path deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
