import userModel from "../models/userModel.js";
import multer from 'multer';

export const getData = async (req, res) => {
    try {
        const users = await userModel.find({});
        
        if (!users || users.length === 0) {
            return res.json({ success: false, message: "User Data not found firstly signup" });
        }
        if(users.isAdmin)
        {

        const userMap = users.map(user => ({
            _id: user._id,
            name: user.name,
            email: user.email,
            status: user.status,
            profileImage: user.profileImage || "",
        }));

        res.json({
            success: true,
            users: userMap  // ✅ Correct response
        });
      }
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};


export  const Status_check =async (req, res) => {
    try {
      const { userId, status } = req.body;
      
      // ✅ Check karo user exist karta hai ya nahi
      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: "Signup up .User not found" });
      }
  
      user.status = status;
      await user.save();
  
      res.json({ success: true, message: "User status updated", user });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

