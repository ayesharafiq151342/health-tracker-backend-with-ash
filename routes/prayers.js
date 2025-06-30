import express from 'express';
import PrayerRecord from '../models/PrayerRecord.js';
import PrayerSummary from '../models/PrayerSummary.js';
const PrayerSummarys = express.Router();

/**
 * POST /api/prayers/update
 */
/**
 * POST /api/prayers/update
 */
PrayerSummarys.post("/update", async (req, res) => {
  try {
    const { userId, date, prayer, status } = req.body;
    if (!userId || !date || !prayer || !status || !["completed", "missed", "qaza"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields (userId, date, prayer, status) or invalid status.",
      });
    }

    const day = new Date(date);
    day.setHours(0, 0, 0, 0);

    let record = await PrayerRecord.findOne({ userId, date: day });
    if (!record) {
      record = new PrayerRecord({ userId, date: day, prayers: {} });
    }

    // Update the specific prayer status
    record.prayers[prayer] = status; // Use the provided status directly
    await record.save();

    return res.json({ success: true, message: "Prayer status updated.", record });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
});

/**
 * GET /api/prayers
 */
PrayerSummarys.get("/", async (req, res) => {
  try {
    const { userId, date } = req.query;
    if (!userId || !date) {
      return res.status(400).json({ success: false, message: "Missing userId or date." });
    }

    const day = new Date(date);
    const record = await PrayerRecord.findOne({ userId, date: day });

    return res.json({ success: true, record });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
});

/**
 * GET /api/prayers/summarys
 */
PrayerSummarys.get("/summarys", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ success: false, message: "Missing userId." });
    }

    const records = await PrayerRecord.find({ userId });
    const summary = { completed: 0, missed: 0, qaza: 0 };

    records.forEach(record => {
      Object.values(record.prayers).forEach((status) => {
        if (status === "completed") summary.completed++;
        else if (status === "missed") summary.missed++;
        else if (status === "qaza") summary.qaza++;
      });
    });

    return res.json({ success: true, summary });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
});

/**
 * POST /api/prayers/reset
 */
PrayerSummarys.post("/reset", async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Missing userId.",
      });
    }
    await PrayerRecord.deleteMany({ userId });
    return res.json({ success: true, message: "Prayer progress reset." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
});

/**
 * POST /api/prayers/summarys
 */
PrayerSummarys.post("/summarys", async (req, res) => {
  try {
    const { userId, completed, missed, qaza } = req.body;

    if (!userId || completed === undefined || missed === undefined || qaza === undefined) {
      return res.status(400).json({ success: false, message: "Missing fields in request body." });
    }

    const newSummary = new PrayerSummary({ userId, completed, missed, qaza });
    await newSummary.save();

    return res.status(200).json({ success: true, message: "Summary saved successfully." });
  } catch (err) {
    console.error("Error saving summary:", err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
});

export default PrayerSummarys;