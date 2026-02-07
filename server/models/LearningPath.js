const mongoose = require('mongoose');

const learningPathSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    thumbnail: String,
    nodes: [{
        title: String,
        type: {
            type: String,
            enum: ['course', 'quiz'],
            default: 'course'
        },
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course'
        },
        quizId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Quiz'
        },
        status: { // Default status definition, overridden by user progress
            type: String,
            enum: ['completed', 'active', 'locked'],
            default: 'locked'
        },
        position: {
            x: Number,
            y: Number
        },
        order: Number
    }],
    connections: [{
        from: Number,
        to: Number
    }],
    category: String,
    estimatedDuration: String,
    enrolledCount: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('LearningPath', learningPathSchema);
