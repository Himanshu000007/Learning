const mongoose = require('mongoose');

const userProgressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },

    // Time tracking
    totalMinutesLearned: {
        type: Number,
        default: 0
    },
    todayMinutesLearned: {
        type: Number,
        default: 0
    },
    lastActiveDate: {
        type: Date,
        default: Date.now
    },

    // Streak tracking
    currentStreak: {
        type: Number,
        default: 0
    },
    longestStreak: {
        type: Number,
        default: 0
    },

    // Course tracking
    coursesStarted: [{
        courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
        startedAt: { type: Date, default: Date.now },
        lastAccessedAt: { type: Date, default: Date.now },
        completedLessons: [String], // lesson IDs
        totalTimeSpent: { type: Number, default: 0 }, // minutes
        progress: { type: Number, default: 0 } // percentage
    }],

    coursesCompleted: [{
        courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
        completedAt: { type: Date, default: Date.now },
        totalTimeSpent: { type: Number, default: 0 }
    }],

    // Skill score (gamification)
    completedQuizzes: [{
        quizId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Quiz'
        },
        score: Number,
        completedAt: {
            type: Date,
            default: Date.now
        }
    }],
    skillScore: {
        type: Number,
        default: 0
    },

    // Active session
    currentSession: {
        startedAt: Date,
        courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
        lessonId: String
    }
}, {
    timestamps: true
});

// Helper method to check and update streak
userProgressSchema.methods.updateStreak = function () {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastActive = new Date(this.lastActiveDate);
    lastActive.setHours(0, 0, 0, 0);

    const diffDays = Math.floor((today - lastActive) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        // Same day, no change
        return;
    } else if (diffDays === 1) {
        // Consecutive day, increase streak
        this.currentStreak += 1;
        if (this.currentStreak > this.longestStreak) {
            this.longestStreak = this.currentStreak;
        }
    } else {
        // Streak broken
        this.currentStreak = 1;
    }

    // Reset daily minutes if new day
    if (diffDays >= 1) {
        this.todayMinutesLearned = 0;
    }

    this.lastActiveDate = new Date();
};

// Get formatted stats
userProgressSchema.methods.getStats = function () {
    const hours = Math.floor(this.totalMinutesLearned / 60);
    const minutes = this.totalMinutesLearned % 60;

    return {
        hoursLearned: `${hours}.${Math.floor(minutes / 6)}`,
        totalMinutes: this.totalMinutesLearned,
        todayMinutes: this.todayMinutesLearned,
        coursesCompleted: this.coursesCompleted.length,
        coursesInProgress: this.coursesStarted.length,
        currentStreak: this.currentStreak,
        longestStreak: this.longestStreak,
        skillScore: this.skillScore
    };
};

module.exports = mongoose.model('UserProgress', userProgressSchema);
