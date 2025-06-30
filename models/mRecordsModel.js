import mongoose from "mongoose";

const medicalRecordsSchema = new mongoose.Schema(
  {
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    heartBeat: { type: Number, required: true },
    sugar: { type: Number, required: true },
    bloodPressure: {
      systolic: { type: Number, required: true },
      diaSystolic: { type: Number, required: true },
    },
    date: { type: Date, required: true, min: "2020-01-01", max: "2035-01-01" },
  },
  { timestamps: true } )
const userModelRecord =
  mongoose.models.medRecords || mongoose.model("medRecords", medicalRecordsSchema);
export default userModelRecord;
