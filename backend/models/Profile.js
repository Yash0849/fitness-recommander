
const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    fullName: {
      type: String,
      trim: true,
      maxlength: 120,
      default: '',
    },
    username: {
      type: String,
      trim: true,
      maxlength: 60,
      default: '',
    },
    profilePhoto: {
      type: String,
      default: '',
    },
    age: {
      type: Number,
      min: 10,
      max: 100,
      required: true,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'non-binary', 'prefer-not-to-say'],
      required: true,
    },
    height: {
      type: Number,
      min: 100,
      max: 250,
      required: true,
    },
    weight: {
      type: Number,
      min: 25,
      max: 300,
      required: true,
    },
    bmi: {
      type: Number,
      min: 5,
      max: 100,
      required: true,
    },
    fitnessGoal: {
      type: String,
      enum: ['weight-loss', 'muscle-gain', 'maintenance', 'endurance', 'general-fitness'],
      required: true,
    },
    sleepHours: {
      type: Number,
      min: 0,
      max: 24,
      required: true,
    },
    injuryHistory: {
      type: [String],
      default: [],
    },
    experienceLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Profile', profileSchema);
