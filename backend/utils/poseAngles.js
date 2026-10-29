const getPoint = (landmarks, index) => landmarks[index] || { x: 0, y: 0, z: 0, visibility: 0 };

const calculateAngle = (a, b, c) => {
  const ab = Math.atan2(a.y - b.y, a.x - b.x);
  const cb = Math.atan2(c.y - b.y, c.x - b.x);
  let angle = Math.abs((cb - ab) * (180 / Math.PI));

  if (angle > 180) {
    angle = 360 - angle;
  }

  return Math.round(angle * 10) / 10;
};

const average = (values) => {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
};

const getMidpoint = (a, b) => ({
  x: (a.x + b.x) / 2,
  y: (a.y + b.y) / 2,
  z: (a.z + b.z) / 2,
});

const getSquatAngles = (landmarks) => {
  const leftHip = getPoint(landmarks, 23);
  const leftKnee = getPoint(landmarks, 25);
  const leftAnkle = getPoint(landmarks, 27);
  const rightHip = getPoint(landmarks, 24);
  const rightKnee = getPoint(landmarks, 26);
  const rightAnkle = getPoint(landmarks, 28);
  const leftShoulder = getPoint(landmarks, 11);
  const rightShoulder = getPoint(landmarks, 12);

  const kneeAngle = average([
    calculateAngle(leftHip, leftKnee, leftAnkle),
    calculateAngle(rightHip, rightKnee, rightAnkle),
  ]);

  const hipAngle = average([
    calculateAngle(leftShoulder, leftHip, leftKnee),
    calculateAngle(rightShoulder, rightHip, rightKnee),
  ]);

  const torsoLean = average([
    Math.abs(leftShoulder.x - leftHip.x),
    Math.abs(rightShoulder.x - rightHip.x),
  ]);

  return { kneeAngle, hipAngle, torsoLean };
};

const getPushupAngles = (landmarks) => {
  const leftShoulder = getPoint(landmarks, 11);
  const leftElbow = getPoint(landmarks, 13);
  const leftWrist = getPoint(landmarks, 15);
  const rightShoulder = getPoint(landmarks, 12);
  const rightElbow = getPoint(landmarks, 14);
  const rightWrist = getPoint(landmarks, 16);
  const leftHip = getPoint(landmarks, 23);
  const rightHip = getPoint(landmarks, 24);
  const leftAnkle = getPoint(landmarks, 27);
  const rightAnkle = getPoint(landmarks, 28);

  const elbowAngle = average([
    calculateAngle(leftShoulder, leftElbow, leftWrist),
    calculateAngle(rightShoulder, rightElbow, rightWrist),
  ]);

  const bodyLine = Math.abs(
    calculateAngle(getMidpoint(leftShoulder, rightShoulder), getMidpoint(leftHip, rightHip), getMidpoint(leftAnkle, rightAnkle)) - 180
  );

  return { elbowAngle, bodyLine };
};

const getDeadliftAngles = (landmarks) => {
  const leftShoulder = getPoint(landmarks, 11);
  const rightShoulder = getPoint(landmarks, 12);
  const leftHip = getPoint(landmarks, 23);
  const rightHip = getPoint(landmarks, 24);
  const leftKnee = getPoint(landmarks, 25);
  const rightKnee = getPoint(landmarks, 26);
  const leftAnkle = getPoint(landmarks, 27);
  const rightAnkle = getPoint(landmarks, 28);

  const backAngle = average([
    calculateAngle(leftShoulder, leftHip, leftKnee),
    calculateAngle(rightShoulder, rightHip, rightKnee),
  ]);

  const kneeAngle = average([
    calculateAngle(leftHip, leftKnee, leftAnkle),
    calculateAngle(rightHip, rightKnee, rightAnkle),
  ]);

  return { backAngle, kneeAngle };
};

const getPlankAngles = (landmarks) => {
  const leftShoulder = getPoint(landmarks, 11);
  const rightShoulder = getPoint(landmarks, 12);
  const leftHip = getPoint(landmarks, 23);
  const rightHip = getPoint(landmarks, 24);
  const leftAnkle = getPoint(landmarks, 27);
  const rightAnkle = getPoint(landmarks, 28);

  const bodyLine = Math.abs(
    calculateAngle(getMidpoint(leftShoulder, rightShoulder), getMidpoint(leftHip, rightHip), getMidpoint(leftAnkle, rightAnkle)) - 180
  );

  return { bodyLine };
};

module.exports = {
  calculateAngle,
  getSquatAngles,
  getPushupAngles,
  getDeadliftAngles,
  getPlankAngles,
};
