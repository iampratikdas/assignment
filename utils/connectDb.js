const mongoose = require('mongoose');
const {Config} = require('./config'); 
const MONGO_URI = Config.mongo_url;

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1); 
    });

const connectDB = mongoose.createConnection(MONGO_URI, { maxPoolSize: 10 });
exports.connectDB= connectDB;