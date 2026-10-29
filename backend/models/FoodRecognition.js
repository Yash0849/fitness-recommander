const mongoose = require('mongoose');

const labelSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    confidence: { type: Number, required: true },
  },
  { _id: false }
);

const foodRecognitionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    source: { type: String, enum: ['upload', 'camera'], default: 'upload' },
    fileName: { type: String, default: '' },
    model: { type: String, default: 'mobilenet' },
    imageData: { type: String, default: '' },
    labels: { type: [labelSchema], default: [] },
    detectedFoods: { type: [String], default: [] },
    status: {
      type: String,
      enum: ['processed', 'failed'],
      default: 'processed',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('FoodRecognition', foodRecognitionSchema);
