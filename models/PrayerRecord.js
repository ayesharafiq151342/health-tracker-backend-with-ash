import mongoose from 'mongoose';

const prayerRecordSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  date: { type: Date, required: true },
  prayers: {
    Fajr: { type: String, enum: ["completed", "missed", "qaza"], default: undefined },
    Dhuhr: { type: String, enum: ["completed", "missed", "qaza"], default: undefined },
    Asr: { type: String, enum: ["completed", "missed", "qaza"], default: undefined },
    Maghrib: { type: String, enum: ["completed", "missed", "qaza"], default: undefined },
    Isha: { type: String, enum: ["completed", "missed", "qaza"], default: undefined },
  }
});

const PrayerRecord = mongoose.model('PrayerRecord', prayerRecordSchema);

export default PrayerRecord;