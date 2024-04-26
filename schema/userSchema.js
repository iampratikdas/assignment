
const mongoose = require('mongoose');
const moment = require('moment');
const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true, minlength: 2, maxlength: 100 },
    last_name: { type: String, required: true, minlength: 2, maxlength: 100 },
    email: { type: String, required: true, validate: { validator: value => /\S+@\S+\.\S+/.test(value), message: 'Invalid email address' } },
    password: { type: String, required: true, minlength: 6 },
    account_id: { type: String , required: true},
    created_at: { type: Number, default: moment().unix()},
    profile_image: { type: String },
    updated_by: { type: String },
    updated_at: { type: Number, default: moment().unix()}
});
exports.userSchema = userSchema;