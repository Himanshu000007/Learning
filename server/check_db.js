const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Course = require('./models/Course');
const LearningPath = require('./models/LearningPath');
const Query = require('./models/Query');

const checkDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB\n');

        console.log('--- Database Summary ---');

        // Users
        const users = await User.find({}, 'name email role');
        console.log(`\nUsers (${users.length}):`);
        users.forEach(u => console.log(` - [${u.role}] ${u.name} (${u.email})`));

        // Courses
        const courses = await Course.find({}, 'title category difficulty');
        console.log(`\nCourses (${courses.length}):`);
        courses.forEach(c => console.log(` - ${c.title} (${c.category} - ${c.difficulty})`));

        // Learning Paths
        const paths = await LearningPath.find({}, 'title category');
        console.log(`\nLearning Paths (${paths.length}):`);
        paths.forEach(p => console.log(` - ${p.title} (${p.category})`));

        // Queries
        const queries = await Query.find({}, 'subject status user').populate('user', 'name');
        console.log(`\nQueries/Feedback (${queries.length}):`);
        queries.forEach(q => console.log(` - [${q.status}] ${q.subject} (by ${q.user?.name || 'unknown'})`));

        process.exit(0);
    } catch (error) {
        console.error('Error checking DB:', error);
        process.exit(1);
    }
};

checkDb();
