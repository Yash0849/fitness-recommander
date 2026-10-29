const DietLog = require('../models/DietLog');

exports.createDietLog = async (req, res) => {
  try {
    const dietLog = new DietLog({ ...req.body, user: req.user.id });
    await dietLog.save();
    res.status(201).json(dietLog);
  } catch (err) {
    res.status(500).json({ message: 'Error creating diet log', error: err.message });
  }
};

exports.getDietLogs = async (req, res) => {
  try {
    const logs = await DietLog.find({ user: req.user.id });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching diet logs', error: err.message });
  }
};

exports.updateDietLog = async (req, res) => {
  try {
    const log = await DietLog.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!log) return res.status(404).json({ message: 'Diet log not found' });
    res.json(log);
  } catch (err) {
    res.status(500).json({ message: 'Error updating diet log', error: err.message });
  }
};

exports.deleteDietLog = async (req, res) => {
  try {
    const log = await DietLog.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!log) return res.status(404).json({ message: 'Diet log not found' });
    res.json({ message: 'Diet log deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting diet log', error: err.message });
  }
}; 