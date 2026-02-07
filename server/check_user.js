const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

async function checkUser() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const email = 'himanshu8809564335@gmail.com';
        const user = await User.findOne({ email });
        console.log(user ? `User found: ${user.username}` : 'User not found');
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

checkUser();
