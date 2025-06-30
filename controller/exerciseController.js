import ExerciseModel from "../models/exerciseModel.js";

// ✅ Create Exercise
export const createExercise = async (req, res) => {
    try {
        const { userId, name, duration, category, date } = req.body;

        if (!name || !duration || !category || !date) {
            return res.json({ success: false, message: "All fields are required" });
        }

        const newExercise = new ExerciseModel({
            user: userId,
            name,
            duration,
            category,
            date,
        });

        await newExercise.save();
        res.json({ success: true, message: "Exercise added successfully!", exercise: newExercise });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ Get Exercises
export const getExercises = async (req, res) => {
  try {
    const exercises = await ExerciseModel.find({ user: req.body.userId });

    if (!exercises.length) {
      return res.json({ success: true, exercises: [] }); // ✅ Avoid undefined data
    }

    res.json({ success: true, exercises });
  } catch (error) {
    // console.error("Error fetching exercises:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};import mongoose from "mongoose";


export const editExercise = async (req, res) => {
  const { userId, name, duration, category, date } = req.body;
  const { id } = req.params;
  // const userId = req.user.userId; // ✅ Get from token

  // console.log("Update Request:", { id, userId, name, duration, category, date }); // ✅ Debugging

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid exercise ID" });
  }

  try {
    const exercise = await ExerciseModel.findById(id);
    if (!exercise) {
      return res.status(404).json({ success: false, message: "Exercise not found" });
    }

    if (exercise.user.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Unauthorized: You cannot edit this exercise" });
    }

    const updatedExercise = await ExerciseModel.findByIdAndUpdate(
      id,
      { name, duration, category, date },
      { new: true }
    );

    res.json({ success: true, message: "Exercise updated successfully!", exercise: updatedExercise });

  } catch (error) {
    // console.error("Error updating exercise:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// ✅ Delete Exercise
export const deleteExercise = async (req, res) => {
 
  try {
      const exerciseId = req.params.id;
        const deletedExercise = await ExerciseModel.findByIdAndDelete(exerciseId);

        if (!deletedExercise) {
            return res.status(404).json({ success: false, message: "Exercise not found" });
        }

        res.json({ success: true, message: "Exercise deleted successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
