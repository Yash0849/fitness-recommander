const allowedGenders = ['male', 'female', 'non-binary', 'prefer-not-to-say'];
const allowedGoals = ['weight-loss', 'muscle-gain', 'maintenance', 'endurance', 'general-fitness'];
const allowedExperienceLevels = ['beginner', 'intermediate', 'advanced'];

const isValidNumber = (value) => typeof value === 'number' && Number.isFinite(value);

const sanitizeStringArray = (value) => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => `${item}`.trim())
    .filter(Boolean)
    .slice(0, 10);
};

const validateFitnessProfile = (req, res, next) => {
  const {
    fullName = '',
    username = '',
    profilePhoto = '',
    age,
    gender,
    height,
    weight,
    fitnessGoal,
    sleepHours,
    injuryHistory,
    experienceLevel,
  } = req.body;

  const normalizedBody = {
    fullName: `${fullName}`.trim(),
    username: `${username}`.trim(),
    profilePhoto: `${profilePhoto}`.trim(),
    age: Number(age),
    gender: `${gender}`.trim(),
    height: Number(height),
    weight: Number(weight),
    fitnessGoal: `${fitnessGoal}`.trim(),
    sleepHours: Number(sleepHours),
    injuryHistory: sanitizeStringArray(injuryHistory),
    experienceLevel: `${experienceLevel}`.trim(),
  };

  const errors = {};

  if (!normalizedBody.fullName || normalizedBody.fullName.length < 2) {
    errors.fullName = 'Full name must be at least 2 characters long';
  }

  if (!normalizedBody.username || normalizedBody.username.length < 3) {
    errors.username = 'Username must be at least 3 characters long';
  }

  if (!isValidNumber(normalizedBody.age) || normalizedBody.age < 10 || normalizedBody.age > 100) {
    errors.age = 'Age must be between 10 and 100';
  }

  if (!allowedGenders.includes(normalizedBody.gender)) {
    errors.gender = 'Please select a valid gender';
  }

  if (!isValidNumber(normalizedBody.height) || normalizedBody.height < 100 || normalizedBody.height > 250) {
    errors.height = 'Height must be between 100 cm and 250 cm';
  }

  if (!isValidNumber(normalizedBody.weight) || normalizedBody.weight < 25 || normalizedBody.weight > 300) {
    errors.weight = 'Weight must be between 25 kg and 300 kg';
  }

  if (!allowedGoals.includes(normalizedBody.fitnessGoal)) {
    errors.fitnessGoal = 'Please select a valid fitness goal';
  }

  if (!isValidNumber(normalizedBody.sleepHours) || normalizedBody.sleepHours < 0 || normalizedBody.sleepHours > 24) {
    errors.sleepHours = 'Sleep hours must be between 0 and 24';
  }

  if (!allowedExperienceLevels.includes(normalizedBody.experienceLevel)) {
    errors.experienceLevel = 'Please select a valid workout experience level';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  req.body = normalizedBody;
  next();
};

module.exports = validateFitnessProfile;
