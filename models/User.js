// create mongoose model
const mongoose = require('mongoose');

// create schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true }
});

// export model
module.exports = mongoose.model('User', userSchema);