import mongoose from "mongoose";

const summarySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  completed: { type: Number, default: 0 },
  missed: { type: Number, default: 0 },
  qaza: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const PrayerSummary = mongoose.model("PrayerSummary", summarySchema);

export default PrayerSummary;