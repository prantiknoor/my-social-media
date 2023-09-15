const mongoose = require("mongoose");

const connectDB = async (testDB = false) => {
    const dbName = testDB ? 'test' : 'main'

    await mongoose.connect('mongodb://127.0.0.1:27017/' + dbName);

    console.log('Database connected successfully');
}

module.exports = { connectDB }