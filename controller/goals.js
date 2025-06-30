
import Goal from '../models/goal.js'

// Route to create or update a user's goal
export const createGoal = async (req, res)=>
{
  try {
    const {userId, calorieGoal, exerciseGoal} = req.body;
    
    // Find if a goal already exists for the user
    let goal = await Goal.findOne({ user: userId });

    if (goal) {
      // Update existing goal
      goal.calorieGoal = calorieGoal;
      goal.exerciseGoal = exerciseGoal;
      await goal.save();
      res.json(goal);
    } else {
      // Create a new goal
      const newGoal = new Goal({
        user: userId,
        calorieGoal,
        exerciseGoal
      });
      const savedGoal = await newGoal.save();
      res.status(201).json(savedGoal);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Route to get a user's goal
export const getGoal = async (req, res) => {
  try {
    // Assuming you have middleware to get the logged-in user's ID
    const userId = req.body.userId; // Replace with actual user ID retrieval
   
    const goal = await Goal.findOne({ user: userId });
    if (goal) {
        
      return res.json({success: true, goal});
    } else {
      res.status(404).json({ message: 'Goal not found for this user' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

