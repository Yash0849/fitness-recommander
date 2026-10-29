const mongoose = require('mongoose');

const workoutExerciseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    sets: { type: Number, default: 0 },
    reps: { type: Number, default: 0 },
    duration: { type: Number, default: 0 },
    notes: { type: String, default: '' },
    substitutedFrom: { type: String, default: '' },
  },
  { _id: false }
);

const workoutDaySchema = new mongoose.Schema(
  {
    workoutType: { type: String, required: true },
    exercises: { type: [workoutExerciseSchema], default: [] },
    duration: { type: Number, required: true },
    intensity: {
      type: String,
      enum: ['low', 'moderate', 'high'],
      required: true,
    },
    focus: { type: String, default: '' },
    recoveryNotes: { type: String, default: '' },
    warnings: { type: [String], default: [] },
  },
  { _id: false }
);

const weeklyPlanSchema = new mongoose.Schema(
  {
    monday: { type: workoutDaySchema, required: true },
    tuesday: { type: workoutDaySchema, required: true },
    wednesday: { type: workoutDaySchema, required: true },
    thursday: { type: workoutDaySchema, required: true },
    friday: { type: workoutDaySchema, required: true },
    saturday: { type: workoutDaySchema, required: true },
    sunday: { type: workoutDaySchema, required: true },
  },
  { _id: false }
);

const workoutPlanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    goal: {
      type: String,
      enum: ['weight-loss', 'muscle-gain', 'maintenance', 'endurance', 'general-fitness'],
      required: true,
    },
    bmi: { type: Number, required: true },
    age: { type: Number, required: true },
    sleepQuality: {
      type: String,
      enum: ['poor', 'average', 'good'],
      required: true,
    },
    injuryHistory: { type: [String], default: [] },
    experienceLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      required: true,
    },
    weeklyPlan: {
      type: weeklyPlanSchema,
      required: true,
    },
    recommendations: { type: [String], default: [] },
    warnings: { type: [String], default: [] },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('WorkoutPlan', workoutPlanSchema);
