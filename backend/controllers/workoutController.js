const Workout = require('../models/Workout'); 
const User = require('../models/User'); 

exports.createWorkout = async (req, res) => {
  const { workoutType, duration, caloriesBurned, date } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const workout = new Workout({
      user: userId,
      type: workoutType,
      duration,
      caloriesBurned,
      date: date || new Date(),
    });

    await workout.save();

    res.status(201).json({ message: "Workout created successfully", workout });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getWorkouts = async (req, res) => {
  const userId = req.user.id;

  try {
    const workouts = await Workout.find({ user: userId });
    res.status(200).json({ workouts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getWorkoutById = async (req, res) => {
  const { workoutId } = req.params;
  const userId = req.user.id;

  try {
    const workout = await Workout.findOne({ _id: workoutId, user: userId });
    if (!workout) {
      return res.status(404).json({ message: "Workout not found" });
    }

    res.status(200).json({ workout });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateWorkout = async (req, res) => {
  const { workoutId } = req.params;
  const { workoutType, duration, caloriesBurned, date } = req.body;
  const userId = req.user.id;

  try {
    const workout = await Workout.findOneAndUpdate(
      { _id: workoutId, user: userId },
      { type: workoutType, duration, caloriesBurned, date },
      { new: true } 
    );

    if (!workout) {
      return res.status(404).json({ message: "Workout not found" });
    }

    res.status(200).json({ message: "Workout updated successfully", workout });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteWorkout = async (req, res) => {
  const { workoutId } = req.params;
  const userId = req.user.id;

  try {
    const workout = await Workout.findOneAndDelete({ _id: workoutId, user: userId });

    if (!workout) {
      return res.status(404).json({ message: "Workout not found" });
    }

    res.status(200).json({ message: "Workout deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
