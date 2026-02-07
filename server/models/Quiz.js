const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    questions: [{
        question: {
            type: String,
            required: true
        },
        options: [{
            type: String,
            required: true
        }],
        correctAnswer: { // Index of correct option (0-3)
            type: Number,
            required: true
        }
    }],
    passingScore: {
        type: Number,
        default: 70
    }
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);
