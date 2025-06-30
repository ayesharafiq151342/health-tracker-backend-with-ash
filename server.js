import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import connectDB from "./config/mongodb.js";
import authRouter from './routes/authRoutes.js';
import userRoutes from "./routes/userRoutes.js";
import path from 'path';
import transporter from './config/nodeMailer.js';
import nodeCron from 'node-cron';
import mongoose from "mongoose";
import { fileURLToPath } from 'url';

const app = express();
const port = process.env.PORT || 4000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

connectDB();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

// API Endpoints
app.use('/api/auth', authRouter);
app.use("/api/users", userRoutes);

// Reminder Schema & Routes
const reminderSchema = new mongoose.Schema({
  description: String,
  time: String,
  email: String,
});
const Reminder = mongoose.model("Reminder", reminderSchema);

app.post("/add-reminder", async (req, res) => {
  const { description, time, email } = req.body;
  const newReminder = new Reminder({ description, time, email });
  await newReminder.save();
  res.json({ success: true, message: "Reminder added successfully!" });
});

app.get("/reminders", async (req, res) => {
  const reminders = await Reminder.find();
  res.json(reminders);
});

// Cron Job: Check every minute
nodeCron.schedule("* * * * *", async () => {
  const now = new Date().toTimeString().slice(0, 5);
  const reminders = await Reminder.find({ time: now });

  reminders.forEach((reminder) => {
    transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: reminder.email,
      subject: 'Health Tracker App Reminder',
      text: `${reminder.description}!`,
    }, (err, info) => {
      if (err) {
        console.error("❌ Email failed:", err.message);
      } else {
        console.log("✅ Reminder sent:", info.response);
      }
    });
  });
});

app.listen(port, () => {
  console.log(`🚀 Server listening on http://localhost:${port}`);
});
