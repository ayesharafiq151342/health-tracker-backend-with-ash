import mongoose from "mongoose";

const mealSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    category: {
        type: String,
        required: true,
    },
    calories: {
        type: Number,
        required: true
    },
    carbs: {
        type: Number,
        required: true
    },
    fats: {
        type: Number,
        required: true
    },
    protiens: {
        type: Number,
        required: true
    },
    sodium: {
        type: Number,
        required: true
    },
    fiber: {
        type: Number,
        required: true
    },
    sugar: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const MealModel = mongoose.model("meal", mealSchema);
export default MealModel;
