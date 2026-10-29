const validateFoodDetectRequest = (req, res, next) => {
  const { imageData, fileName, predictions } = req.body;

  if (!imageData && !fileName && (!Array.isArray(predictions) || !predictions.length)) {
    return res.status(400).json({
      success: false,
      message: 'Food detection requires an image payload or model predictions',
    });
  }

  next();
};

const validatePostureAnalyzeRequest = (req, res, next) => {
  const { exercise, landmarks } = req.body;

  if (!exercise || !['squat', 'pushup', 'deadlift', 'plank'].includes(exercise)) {
    return res.status(400).json({
      success: false,
      message: 'A supported exercise is required',
    });
  }

  if (!Array.isArray(landmarks) || landmarks.length < 20) {
    return res.status(400).json({
      success: false,
      message: 'Pose landmarks are required for analysis',
    });
  }

  next();
};

const validatePostureSessionRequest = (req, res, next) => {
  const { exercise, reps, averageScore } = req.body;

  if (!exercise || !['squat', 'pushup', 'deadlift', 'plank'].includes(exercise)) {
    return res.status(400).json({
      success: false,
      message: 'A supported exercise is required',
    });
  }

  if (!Number.isFinite(Number(reps)) || !Number.isFinite(Number(averageScore))) {
    return res.status(400).json({
      success: false,
      message: 'Reps and average score must be numeric',
    });
  }

  next();
};

module.exports = {
  validateFoodDetectRequest,
  validatePostureAnalyzeRequest,
  validatePostureSessionRequest,
};
