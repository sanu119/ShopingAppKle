const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('✅  Database connected');
    } catch (error) {
        console.log('❌  Database connection failed:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
