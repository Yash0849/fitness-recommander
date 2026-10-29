const mongoose = require('mongoose');

const progressLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  weight: Number,
  bodyFat: Number,
  notes: String
});

module.exports = mongoose.model('ProgressLog', progressLogSchema);
