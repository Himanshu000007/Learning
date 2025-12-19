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
        status: {
            type: String,
            enum: ['completed', 'active', 'locked'],
            default: 'locked'
        },
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course'
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
