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
        enum: [
            'Web Development', 'Frontend', 'Backend', 'Full Stack',
            'Data Science', 'Machine Learning', 'Artificial Intelligence',
            'Mobile Development', 'DevOps', 'Cloud Computing',
            'Design', 'UI/UX', 'Graphic Design',
            'Computer Science', 'DSA', 'Operating Systems', 'DBMS', 'System Design', 'Networks',
            'Cybersecurity', 'Blockchain', 'Other'
        ]
    },
    difficulty: {
        type: String,
        enum: ['Beginner', 'Beginner to Intermediate', 'Intermediate', 'Advanced', 'All Levels'],
        default: 'Beginner'
    },
    duration: {
        type: String,
        default: '0 hours'
    },
    modules: [{
        title: { type: String, required: true },
        lessons: [{
            title: { type: String, required: true },
            videoUrl: String, // For internal videos
            youtubeUrl: String, // For YouTube embeds
            duration: String,
            content: String, // Text content
            freePreview: { type: Boolean, default: false }
        }]
    }],
    instructor: {
        name: String,
        avatar: String,
        bio: String
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
