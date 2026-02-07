const express = require('express');
const jwt = require('jsonwebtoken');
const UserProgress = require('../models/UserProgress');
const router = express.Router();

// Middleware to verify token
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
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

// Get user stats
router.get('/stats', auth, async (req, res) => {
    try {
        let progress = await UserProgress.findOne({ userId: req.userId });

        // Create progress record if doesn't exist
        if (!progress) {
            progress = new UserProgress({ userId: req.userId });
            await progress.save();
        }

        // Update streak
        progress.updateStreak();
        await progress.save();

        res.json(progress.getStats());
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Start learning session
router.post('/start-session', auth, async (req, res) => {
    try {
        const { courseId, lessonId } = req.body;

        let progress = await UserProgress.findOne({ userId: req.userId });

        if (!progress) {
            progress = new UserProgress({ userId: req.userId });
        }

        // Update streak
        progress.updateStreak();

        // Start session
        progress.currentSession = {
            startedAt: new Date(),
            courseId,
            lessonId
        };

        // Update course started if new
        const courseStarted = progress.coursesStarted.find(
            c => c.courseId?.toString() === courseId
        );

        if (!courseStarted && courseId) {
            progress.coursesStarted.push({
                courseId,
                startedAt: new Date(),
                lastAccessedAt: new Date()
            });
        } else if (courseStarted) {
            courseStarted.lastAccessedAt = new Date();
        }

        await progress.save();

        res.json({ message: 'Session started', sessionId: progress.currentSession.startedAt });
    } catch (error) {
        console.error('Start session error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// End learning session
router.post('/end-session', auth, async (req, res) => {
    try {
        const { duration } = req.body; // duration in minutes

        let progress = await UserProgress.findOne({ userId: req.userId });

        if (!progress) {
            return res.status(404).json({ message: 'No progress found' });
        }

        const minutes = Math.round(duration || 0);

        // Update time
        progress.totalMinutesLearned += minutes;
        progress.todayMinutesLearned += minutes;

        // Update skill score (1 point per minute, bonus for streak)
        const streakBonus = Math.min(progress.currentStreak * 0.1, 0.5); // max 50% bonus
        progress.skillScore += Math.round(minutes * (1 + streakBonus));

        // Update course time if in session
        if (progress.currentSession?.courseId) {
            const course = progress.coursesStarted.find(
                c => c.courseId?.toString() === progress.currentSession.courseId?.toString()
            );
            if (course) {
                course.totalTimeSpent += minutes;
            }
        }

        // Clear session
        progress.currentSession = undefined;

        await progress.save();

        res.json({
            message: 'Session ended',
            stats: progress.getStats()
        });
    } catch (error) {
        console.error('End session error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Complete a lesson
router.post('/complete-lesson', auth, async (req, res) => {
    try {
        const { courseId, lessonId } = req.body;

        let progress = await UserProgress.findOne({ userId: req.userId });

        if (!progress) {
            progress = new UserProgress({ userId: req.userId });
        }

        const course = progress.coursesStarted.find(
            c => c.courseId?.toString() === courseId
        );

        if (course && !course.completedLessons.includes(lessonId)) {
            course.completedLessons.push(lessonId);

            // Award points for completing lesson
            progress.skillScore += 10;
        }

        await progress.save();

        res.json({
            message: 'Lesson completed',
            completedLessons: course?.completedLessons || []
        });
    } catch (error) {
        console.error('Complete lesson error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update course progress percentage
router.post('/update-progress', auth, async (req, res) => {
    try {
        const { courseId, progress: courseProgress } = req.body;

        let userProgress = await UserProgress.findOne({ userId: req.userId });

        if (!userProgress) {
            return res.status(404).json({ message: 'No progress found' });
        }

        const course = userProgress.coursesStarted.find(
            c => c.courseId?.toString() === courseId
        );

        if (course) {
            course.progress = courseProgress;

            // If 100% complete, move to completed
            if (courseProgress >= 100) {
                userProgress.coursesCompleted.push({
                    courseId,
                    completedAt: new Date(),
                    totalTimeSpent: course.totalTimeSpent
                });

                // Award completion bonus
                userProgress.skillScore += 100;

                // Remove from in-progress
                userProgress.coursesStarted = userProgress.coursesStarted.filter(
                    c => c.courseId?.toString() !== courseId
                );
            }
        }

        await userProgress.save();

        res.json({ message: 'Progress updated' });
    } catch (error) {
        console.error('Update progress error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get courses in progress
router.get('/courses-in-progress', auth, async (req, res) => {
    try {
        const progress = await UserProgress.findOne({ userId: req.userId })
            .populate('coursesStarted.courseId');

        if (!progress) {
            return res.json([]);
        }

        res.json(progress.coursesStarted);
    } catch (error) {
        console.error('Get courses error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Complete a quiz
router.post('/complete-quiz', auth, async (req, res) => {
    try {
        const { quizId, score, passed } = req.body;

        const progress = await UserProgress.findOne({ userId: req.userId });
        if (!progress) {
            return res.status(404).json({ message: 'Progress not found' });
        }

        // Check if already completed
        const existingIndex = progress.completedQuizzes.findIndex(q => q.quizId.toString() === quizId);

        if (existingIndex > -1) {
            // Update score if better
            if (score > progress.completedQuizzes[existingIndex].score) {
                progress.completedQuizzes[existingIndex].score = score;
                progress.completedQuizzes[existingIndex].completedAt = new Date();
            }
        } else if (passed) {
            // Add new completion
            progress.completedQuizzes.push({
                quizId,
                score,
                completedAt: new Date()
            });

            // Add skill score points
            progress.skillScore += 50;
            progress.updateStreak();
        }

        await progress.save();
        res.json(progress);
    } catch (error) {
        console.error('Quiz completion error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
