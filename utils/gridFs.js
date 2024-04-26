
const mongoose = require('mongoose');
const MONGO_URI = 'mongodb://practicedb:1234@localhost:27017/practicedb?authSource=practicedb';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

const connectDB = mongoose.createConnection(MONGO_URI, { maxPoolSize: 10 });
let gfs;
connectDB.once('open', () => {
    gfs = new mongoose.mongo.GridFSBucket(connectDB.db, {
        bucketName: 'uploads'
    });
    // console.log("gfs111===>", gfs)
    exports.gridFs = gfs;
});
console.log("gfs===>", gfs)

