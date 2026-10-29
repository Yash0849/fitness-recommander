const ProgressLog = require('../models/ProgressLog');

exports.createProgressLog = async (req, res) => {
  try {
    const progressLog = new ProgressLog({ ...req.body, user: req.user.id });
    await progressLog.save();
    res.status(201).json(progressLog);
  } catch (err) {
    res.status(500).json({ message: 'Error creating progress log', error: err.message });
  }
};

exports.getProgressLogs = async (req, res) => {
  try {
    const logs = await ProgressLog.find({ user: req.user.id });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching progress logs', error: err.message });
  }
};

exports.updateProgressLog = async (req, res) => {
  try {
    const log = await ProgressLog.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!log) return res.status(404).json({ message: 'Progress log not found' });
    res.json(log);
  } catch (err) {
    res.status(500).json({ message: 'Error updating progress log', error: err.message });
  }
};

exports.deleteProgressLog = async (req, res) => {
  try {
    const log = await ProgressLog.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!log) return res.status(404).json({ message: 'Progress log not found' });
    res.json({ message: 'Progress log deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting progress log', error: err.message });
  }
}; 