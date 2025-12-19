const mongoose = require('mongoose');
require('dotenv').config();
const term = require('./models/User'); // Register User model
const Query = require('./models/Query');

const checkQueries = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const queries = await Query.find().populate('user', 'name');
        console.log('--- Queries Dump ---');
        console.log(JSON.stringify(queries, null, 2));
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkQueries();
