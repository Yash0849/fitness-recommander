const profileService = require('../services/profileService');

exports.getMyProfile = async (req, res) => {
  try {
    const profile = await profileService.getProfileByUserId(req.user.id);

    return res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
    });
  }
};

exports.upsertMyProfile = async (req, res) => {
  try {
    const profile = await profileService.upsertProfile(req.user.id, req.body);

    return res.status(200).json({
      success: true,
      message: 'Profile saved successfully',
      profile,
    });
  } catch (error) {
    console.error('Error saving profile:', error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to save profile',
    });
  }
};
