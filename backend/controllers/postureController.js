const ExerciseFeedback = require('../models/ExerciseFeedback');
const PostureSession = require('../models/PostureSession');
const { analyzePosture } = require('../services/postureAnalysisService');

exports.analyze = async (req, res) => {
  try {
    const { exercise, landmarks, previousState = {} } = req.body;
    const analysis = analyzePosture({ exercise, landmarks, previousState });

    return res.status(200).json({
      success: true,
      analysis,
    });
  } catch (error) {
    console.error('Posture analysis error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to analyze posture',
    });
  }
};

exports.saveSession = async (req, res) => {
  try {
    const { exercise, reps, averageScore, durationSeconds, startedAt, endedAt, framesAnalyzed = 0, feedback = [] } = req.body;
    const userId = req.user.id;

    const session = await PostureSession.create({
      user: userId,
      exercise,
      reps,
      averageScore,
      durationSeconds,
      startedAt,
      endedAt,
      framesAnalyzed,
      feedbackSummary: feedback.map((item) => item.message).slice(0, 12),
    });

    const feedbackDocs = await ExerciseFeedback.insertMany(
      feedback.map((item) => ({
        user: userId,
        session: session._id,
        exercise,
        message: item.message,
        severity: item.severity,
        postureScore: item.postureScore || averageScore,
        repCount: item.repCount || reps,
        angles: item.angles || {},
      }))
    );

    session.feedbackRefs = feedbackDocs.map((item) => item._id);
    await session.save();

    return res.status(201).json({
      success: true,
      message: 'Posture session saved successfully',
      sessionId: session._id,
    });
  } catch (error) {
    console.error('Save session error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to save posture session',
    });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    if (userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only view your own session history',
      });
    }

    const sessions = await PostureSession.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate('feedbackRefs')
      .lean();

    return res.status(200).json({
      success: true,
      sessions,
    });
  } catch (error) {
    console.error('History fetch error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch session history',
    });
  }
};
