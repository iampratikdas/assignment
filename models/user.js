
const {userSchema} = require('../schema/userSchema');
const {connectDB} = require('../utils/connectDb');
const userModel = connectDB.model('users', userSchema);
exports.User = userModel;
