const mongoose = require('mongoose');

const exerciseFeedbackSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    session: { type: mongoose.Schema.Types.ObjectId, ref: 'PostureSession', default: null },
    exercise: { type: String, required: true },
    message: { type: String, required: true },
    severity: {
      type: String,
      enum: ['success', 'info', 'warning', 'error'],
      default: 'info',
    },
    postureScore: { type: Number, default: 0 },
    repCount: { type: Number, default: 0 },
    angles: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ExerciseFeedback', exerciseFeedbackSchema);
