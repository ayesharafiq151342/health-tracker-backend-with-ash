import userModelRecord from "../models/mRecordsModel.js";

// ✅ GET Medical Records
export const getRecords = async (req, res) => {
  try {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1; // Month is 0-indexed
    const day = today.getDate();
    
    const records = await userModelRecord.find({ user: req.body.userId }).sort({ $natural: -1 }).limit(30);
    const todayRecords = await userModelRecord.find({user: req.body.userId,  $expr: {
      $and: [
        { $eq: [{ $year: "$date" }, year] },
        { $eq: [{ $month: "$date" }, month] },
        { $eq: [{ $dayOfMonth: "$date" }, day]},
      ]
    }});
    const prevRecords = await userModelRecord.find({user: req.body.userId,  $expr: {
      $and: [
        { $eq: [{ $year: "$date" }, year] },
        { $eq: [{ $month: "$date" }, month] },
        { $eq: [{ $dayOfMonth: "$date" }, day-1]},
      ]
    }});
    res.json({ success: true, records, todayRecords, prevRecords });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ CREATE Medical Record
export const createRecord = async (req, res) => {
  const { userId, heartBeat, systolic, diaSystolic, sugar, date } = req.body;

  if (!heartBeat || !systolic || !diaSystolic || !sugar || !date) {
    return res.json({ success: false, message: "Fields are empty" });
  }


  try {
    const existingRecord = await userModelRecord.findOne({
      user: userId,
      date: new Date(date).toISOString(),
    });

    if (existingRecord) {
      return res.json({ success: false, message: "Today's data already exists" });
    }

    const newRecord = new userModelRecord({
      user: userId,
      heartBeat,
     bloodPressure:
     {
      systolic,
      diaSystolic
     } ,
      sugar,
      date: new Date(date),
    });

    await newRecord.save();
    return res.json({ success: true, message: "Data added successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// ✅ EDIT Medical Record
export const editRecord = async (req, res) => {
  const { date, userId, heartBeat, systolic, diaSystolic, sugar } = req.body;
  const id = req.params.id; // ✅ Ensure Date Format

  if (!heartBeat || !systolic || !diaSystolic || !sugar) {
    return res.json({ success: false, message: "Fields are empty" });
  }

  try {
    const record = await userModelRecord.findOneAndUpdate(
      { user: userId, _id: id },
      { heartBeat, bloodPressure: { systolic, diaSystolic }, sugar, date },
      { new: true }
    );

    if (!record) {
      return res.json({ success: false, message: "No record found for the given date" });
    }

    return res.json({ success: true, message: "Record updated successfully", record });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// ✅ DELETE Medical Record
export const deleteRecord = async (req, res) => {
  const { userId } = req.params.id;
  // const date = new Date(req.params.date).toISOString(); // ✅ Ensure Date Format
  console.log(userId)
  try {
    const deletedRecord = await userModelRecord.findOneAndDelete(userId );

    if (!deletedRecord) {
      return res.json({ success: false, message: "No record found for deletion" });
    }

    return res.json({ success: true, message: "Data deleted successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
