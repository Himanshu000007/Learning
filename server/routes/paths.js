const express = require('express');
const LearningPath = require('../models/LearningPath');
const router = express.Router();

const auth = require('../middleware/auth');
const UserProgress = require('../models/UserProgress');

// Get all learning paths (with progress summary)
router.get('/', auth, async (req, res) => {
    try {
        const paths = await LearningPath.find().lean();
        const progress = await UserProgress.findOne({ userId: req.userId });

        const enrichedPaths = paths.map(path => {
            let completedNodes = 0;
            if (progress) {
                path.nodes.forEach(node => {
                    if (node.type === 'course' && progress.coursesCompleted.includes(node.courseId)) {
                        completedNodes++;
                    } else if (node.type === 'quiz' && progress.completedQuizzes.some(q => q.quizId.toString() === node.quizId?.toString())) {
                        completedNodes++;
                    }
                });
            }
            return { ...path, userProgress: { completedNodes, totalNodes: path.nodes.length } };
        });

        res.json(enrichedPaths);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get single path with detailed node status
router.get('/:id', auth, async (req, res) => {
    try {
        const path = await LearningPath.findById(req.params.id)
            .populate('nodes.courseId')
            .populate('nodes.quizId')
            .lean();

        if (!path) {
            return res.status(404).json({ message: 'Learning path not found' });
        }

        const progress = await UserProgress.findOne({ userId: req.userId });
        let isNextActive = true; // The first node is active by default

        path.nodes = path.nodes.sort((a, b) => a.order - b.order).map(node => {
            let status = 'locked';
            let isCompleted = false;

            if (progress) {
                if (node.type === 'course') {
                    isCompleted = progress.coursesCompleted.some(id => id.toString() === node.courseId._id.toString());
                } else if (node.type === 'quiz') {
                    isCompleted = progress.completedQuizzes.some(q => q.quizId.toString() === node.quizId._id.toString());
                }
            }

            if (isCompleted) {
                status = 'completed';
            } else if (isNextActive) {
                status = 'active';
                isNextActive = false; // Only one active node at a time (the next one)
            } else {
                status = 'locked';
            }

            return { ...node, status };
        });

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
