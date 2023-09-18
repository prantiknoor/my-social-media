const mongoose = require("mongoose");

const connectDB = async (testDB = false) => {
    const dbName = testDB ? 'test' : 'main'

    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/' + dbName);
    } catch (error) {
        console.log('Database connected failed');
    }
}

module.exports = { connectDB }