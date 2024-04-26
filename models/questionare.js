const {questionareSchema} = require('../schema/questionare');
const {connectDB} = require('../utils/connectDb');
const questionareModel = connectDB.model('questionare', questionareSchema);
exports.Questionare = questionareModel;