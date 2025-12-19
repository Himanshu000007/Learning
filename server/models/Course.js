const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        default: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800'
    },
    category: {
        type: String,
        required: true,
        enum: ['Web Development', 'Data Science', 'Machine Learning', 'Mobile Development', 'DevOps', 'Design']
    },
    difficulty: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        default: 'Beginner'
    },
    duration: {
        type: String,
        default: '2 hours'
    },
    modules: [{
        title: String,
        videoUrl: String,
        duration: String,
        order: Number
    }],
    instructor: {
        name: String,
        avatar: String
    },
    rating: {
        type: Number,
        default: 4.5,
        min: 0,
        max: 5
    },
    enrolledCount: {
        type: Number,
        default: 0
    },
    tags: [String]
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
