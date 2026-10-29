const {
  getSquatAngles,
  getPushupAngles,
  getDeadliftAngles,
  getPlankAngles,
} = require('../utils/poseAngles');

const clampScore = (value) => Math.max(0, Math.min(100, Math.round(value)));

const analyzeSquat = (landmarks, previousState = {}) => {
  const angles = getSquatAngles(landmarks);
  const feedback = [];
  let score = 100;
  let phase = previousState.phase || 'up';
  let repDelta = 0;

  if (angles.kneeAngle > 120) {
    feedback.push({ message: 'Your squat depth is low. Sit a little deeper if comfortable.', severity: 'warning' });
    score -= 18;
  }

  if (angles.torsoLean > 0.15) {
    feedback.push({ message: 'Keep your back straighter and chest prouder.', severity: 'warning' });
    score -= 20;
  }

  if (angles.kneeAngle < 100) {
    phase = 'down';
  }

  if (phase === 'down' && angles.kneeAngle > 155) {
    repDelta = 1;
    phase = 'up';
    feedback.push({ message: 'Good squat rep. Drive through the floor.', severity: 'success' });
  }

  if (!feedback.length) {
    feedback.push({ message: 'Good posture! Keep the movement smooth.', severity: 'success' });
  }

  return { angles, postureScore: clampScore(score), feedback, repDelta, phase };
};

const analyzePushup = (landmarks, previousState = {}) => {
  const angles = getPushupAngles(landmarks);
  const feedback = [];
  let score = 100;
  let phase = previousState.phase || 'up';
  let repDelta = 0;

  if (angles.bodyLine > 18) {
    feedback.push({ message: 'Keep your spine aligned and avoid hip sag.', severity: 'warning' });
    score -= 22;
  }

  if (angles.elbowAngle > 120 && phase === 'down') {
    repDelta = 1;
    phase = 'up';
    feedback.push({ message: 'Strong push-up rep. Keep elbows controlled.', severity: 'success' });
  } else if (angles.elbowAngle < 85) {
    phase = 'down';
  } else if (angles.elbowAngle > 155) {
    feedback.push({ message: 'Lower your chest more for a full push-up range.', severity: 'info' });
    score -= 10;
  }

  if (!feedback.length) {
    feedback.push({ message: 'Good posture! Keep your core tight.', severity: 'success' });
  }

  return { angles, postureScore: clampScore(score), feedback, repDelta, phase };
};

const analyzeDeadlift = (landmarks, previousState = {}) => {
  const angles = getDeadliftAngles(landmarks);
  const feedback = [];
  let score = 100;

  if (angles.backAngle < 120) {
    feedback.push({ message: 'Keep your back straighter during the hinge.', severity: 'warning' });
    score -= 25;
  }

  if (angles.kneeAngle < 110) {
    feedback.push({ message: 'Let the hips hinge more and avoid excessive knee travel.', severity: 'info' });
    score -= 12;
  }

  if (!feedback.length) {
    feedback.push({ message: 'Good posture! Hips and back are moving together.', severity: 'success' });
  }

  return {
    angles,
    postureScore: clampScore(score),
    feedback,
    repDelta: previousState.repDelta || 0,
    phase: previousState.phase || 'hinge',
  };
};

const analyzePlank = (landmarks, previousState = {}) => {
  const angles = getPlankAngles(landmarks);
  const feedback = [];
  let score = 100;

  if (angles.bodyLine > 15) {
    feedback.push({ message: 'Lower your hips slightly and keep a straighter line.', severity: 'warning' });
    score -= 20;
  } else {
    feedback.push({ message: 'Good posture! Keep breathing steadily.', severity: 'success' });
  }

  return {
    angles,
    postureScore: clampScore(score),
    feedback,
    repDelta: 0,
    phase: previousState.phase || 'hold',
  };
};

const analyzePosture = ({ exercise, landmarks, previousState = {} }) => {
  const handlers = {
    squat: analyzeSquat,
    pushup: analyzePushup,
    deadlift: analyzeDeadlift,
    plank: analyzePlank,
  };

  const handler = handlers[exercise];

  if (!handler) {
    return {
      angles: {},
      postureScore: 0,
      feedback: [{ message: 'Unsupported exercise for posture analysis.', severity: 'error' }],
      repDelta: 0,
      phase: previousState.phase || 'idle',
    };
  }

  return handler(landmarks, previousState);
};

module.exports = {
  analyzePosture,
};
