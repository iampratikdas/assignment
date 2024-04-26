
const mongoose = require('mongoose');
const moment = require('moment');
const categorySchema = new mongoose.Schema({
    category_id: { type: Number, required: true, minlength: 2, maxlength: 100 },
    category_name:  { type: String, required: true},
    description:  { type: String, required: true},
    created_at: { type: Number, default: moment().unix()},
    updated_at: { type: Number, default: moment().unix()}
});
exports.categorySchema = categorySchema;