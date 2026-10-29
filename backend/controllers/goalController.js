const Goal = require('../models/Goal'); // Assuming you have a Goal model defined
const User = require('../models/User'); // Assuming you have a User model defined

// Create a new fitness goal for a user
exports.createGoal = async (req, res) => {
  const { targetCalories, targetSteps, targetMinutes } = req.body;
  const userId = req.user.id;
  
  try {
    // Find the user by ID to associate the goal with the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create the goal
    const goal = new Goal({
      user: userId,
      type: 'Calories', // Default type
      target: targetCalories || targetSteps || targetMinutes || 0,
      progress: 0,
      date: new Date()
    });

    // Save the goal to the database
    await goal.save();

    res.status(201).json({ message: "Goal created successfully", goal });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all goals for a user
exports.getGoals = async (req, res) => {
  const userId = req.user.id;

  try {
    // Find the user's goals
    const goals = await Goal.find({ user: userId });
    res.status(200).json({ goals });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update a user's goal
exports.updateGoal = async (req, res) => {
  const { goalId } = req.params;
  const { targetCalories, targetSteps, targetMinutes } = req.body;
  const userId = req.user.id;

  try {
    // Find and update the goal
    const goal = await Goal.findOneAndUpdate(
      { _id: goalId, user: userId },
      { 
        target: targetCalories || targetSteps || targetMinutes || 0,
        date: new Date()
      },
      { new: true } // Return the updated goal
    );

    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    res.status(200).json({ message: "Goal updated successfully", goal });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a user's goal
exports.deleteGoal = async (req, res) => {
  const { goalId } = req.params;
  const userId = req.user.id;

  try {
    // Delete the goal from the database
    const goal = await Goal.findOneAndDelete({ _id: goalId, user: userId });

    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    res.status(200).json({ message: "Goal deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
