const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const UserProgress = require('./models/UserProgress');

async function clearUsers() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB...');

        const userResult = await User.deleteMany({});
        console.log(`Deleted ${userResult.deletedCount} users.`);

        const progressResult = await UserProgress.deleteMany({});
        console.log(`Deleted ${progressResult.deletedCount} progress records.`);

        console.log('✅ Database cleared! You can now register as a new user.');
        process.exit(0);
    } catch (error) {
        console.error('Error clearing database:', error);
        process.exit(1);
    }
}

clearUsers();
