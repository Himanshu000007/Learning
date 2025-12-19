const mongoose = require('mongoose');

const querySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    subject: {
        type: String,
        required: true,
        trim: true
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'replied', 'closed'],
        default: 'pending'
    },
    reply: {
        message: String,
        repliedAt: Date,
        repliedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    category: {
        type: String,
        enum: ['general', 'technical', 'billing', 'course', 'other'],
        default: 'general'
    }
}, { timestamps: true });

module.exports = mongoose.model('Query', querySchema);
