const mongoose = require('mongoose');

const postureSessionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    exercise: {
      type: String,
      enum: ['squat', 'pushup', 'deadlift', 'plank'],
      required: true,
    },
    durationSeconds: { type: Number, default: 0 },
    reps: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 },
    startedAt: { type: Date, default: Date.now },
    endedAt: { type: Date, default: Date.now },
    framesAnalyzed: { type: Number, default: 0 },
    feedbackSummary: { type: [String], default: [] },
    feedbackRefs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ExerciseFeedback' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('PostureSession', postureSessionSchema);
