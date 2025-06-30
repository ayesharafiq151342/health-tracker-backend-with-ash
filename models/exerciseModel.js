import mongoose from "mongoose";

const exerciseSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    duration: { type: Number, required: true }, // in minutes
    category: { type: String, required: true },
    date: { type: Date, required: true },
});

const ExerciseModel = mongoose.model("Exercise", exerciseSchema);
export default ExerciseModel;
