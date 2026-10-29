const Profile = require('../models/Profile');
const User = require('../models/User');
const { calculateBMI } = require('../utils/bmi');

const profileProjection = {
  __v: 0,
};

const getProfileByUserId = async (userId) => {
  return Profile.findOne({ user: userId }, profileProjection).lean();
};

const upsertProfile = async (userId, payload) => {
  const user = await User.findById(userId).lean();

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  const bmi = calculateBMI(payload.height, payload.weight);

  const profile = await Profile.findOneAndUpdate(
    { user: userId },
    {
      ...payload,
      bmi,
      user: userId,
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
      projection: profileProjection,
    }
  ).lean();

  return profile;
};

module.exports = {
  getProfileByUserId,
  upsertProfile,
};
