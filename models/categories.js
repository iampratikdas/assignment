const {categorySchema} = require('../schema/categories');
const {connectDB} = require('../utils/connectDb');
const categoryModel = connectDB.model('category', categorySchema);
exports.Category = categoryModel;