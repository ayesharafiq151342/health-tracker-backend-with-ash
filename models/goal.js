import mongoose  from "mongoose";

const goalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Assuming you have a User model for authentication
  },
  calorieGoal: {
    type: Number,
    min: 0,
    default: 0
  },
  exerciseGoal: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const goalModel = mongoose.model('Goal', goalSchema);
export default goalModel;