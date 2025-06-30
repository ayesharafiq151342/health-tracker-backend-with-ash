
import userModel from '../models/userModel.js';



// GET all users
export  const  DataAdmin =
 async (req, res) => {
  try {
    const users = await userModel.find();
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT update user status
export  const  update_status =
async (req, res) => {
  const { userId, status } = req.body;
  try {
    await userModel.findByIdAndUpdate(userId, { status });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT update admin role
export  const  update_admin_by_admin =
async (req, res) => {
  const { userId, isAdmin } = req.body;
  try {
    await userModel.findByIdAndUpdate(userId, { isAdmin });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


