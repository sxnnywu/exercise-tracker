
// create mongoose model 
const mongoose = require('mongoose');
const { use } = require('../app');

// create schema
const exerciseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

// export model
module.exports = mongoose.model('Exercise', exerciseSchema);