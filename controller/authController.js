import userModel from '../models/userModel.js';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import transporter from '../config/nodeMailer.js';
export  const  register = async (req, res)=>
{
    const {name, email, password} = req.body;
    if(!name || !email || !password)
    {
        return res.json({success: false, message: "Data missing"});
    }
    try
    {
        
        const emailExist = await userModel.findOne({email});
        if(emailExist)
        {
            return res.json({success: false, message: "Email Already Exist"});
        }
        const hashPassword = await bcrypt.hash(password, 10);
        const user = new userModel({name, email, password: hashPassword});
        await user.save();
        const token = jwt.sign({id: user._id, role: user.isAdmin},'secret@123',{expiresIn: '1h'});
        res.cookie('token', token, {
            
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV ==='production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
         })
         // Send Email
         const mailOptions = 
         {
            from: process.env.SENDER_EMAIL,
            to: email, 
            subject: 'Account Creation ',
            text: `Welcome to our Channel. Your account has been created with email id ${email}`,
         }
         await transporter.sendMail(mailOptions);
         return res.json({success: true}) 
    }
    catch(error) 
    {
        return res.json({success: false, message: error.message});
    }
}
export const login = async (req, res) => {
    try {
      const { email, password } = req.body;
      // Find user by email
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      console.log(user.isAdmin)
      // Check if the account is deactivated
      if (!user.status) {
        return res.status(403).json({ success: false, message: "Your account is deactivated. Please contact the administrator." });
      }
  
      // Compare passwords (assuming your passwords are hashed)
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: "Password does not match" });
      }
  
      // Generate a token (adjust secret & options as needed)
      const token = jwt.sign({ id: user._id , role: user.isAdmin}, 'secret@123', { expiresIn: '1h' });
       console.log(token)
      // Optionally, set a cookie or return the token
      res.cookie('token', token, {
        
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3600000, // 1 hour
      });
  
      return res.json({ success: true, token, user });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  }
  
export const logout = async (req, res)=>
{
    try 
    {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV ==='production',
            sameSite: process.env.NODE_ENV==='production' ? 'none': 'strict'

        })
        return res.json({success: true, message: "Logged Out"});
    }
    catch(error)
    {
        return res.json({success: false, message: error.message})
    }
}

// send verification OTP to the USer's email 
export const sendVerifyOtp =async (req, res) =>
{
    try 
    {
        const {userId} = req.body;
        const user = await userModel.findById(userId);
        if(user.isAccountVerified)
        {
            return res.json({success: false, message:"account already varified"});
        }
        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
        await user.save();
        
        const mailOptions =
        {
            from: process.env.SENDER_EMAIL,
            to: user.email, 
            subject: 'Account Verification OTP',
            text: `Your otp is ${otp}. Verify your account using this OTP`,
        }
        await transporter.sendMail(mailOptions);
        res.json({success: true, message: 'Verification OTP send on your EMail Address'});
    }
    catch(error)
    {
        res.json({success: false, message: error.message});
    }
}

export const verifyEmail = async (req, res)=>
{

    const {userId, otp} = req.body;
        if(!userId || !otp)
        {
            return res.json({success: false, message: "Data missing"})
        }
    try 
    {
        const user = await userModel.findById(userId);
        if(!user)
        {
            return res.json({success: false, message: 'user not found'});
        }
        if(user.verifyOtp === '' || user.verifyOtp !== otp)
        {
            return res.json({success: false, message: 'Otp does not match'});

        }
        if(user.verifyOtp > Date.now())
        {
            return res.json({success: false, message: 'OTP expired'});

        }
        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0
        await user.save();
        return res.json({success: true, message:'Email Verified Successfuly'});


    }
    catch(error)
    {
        res.json({success: false, message: error.message});

    }
}
export const sendResetOtp = async (req, res)=>
{
    const {email} = req.body;
    if(!email)
    {
        return res.json({success: false, message: 'Empty email field'});
    }
    try 
    {
        const user = await userModel.findOne({email});
        if(!user)
        {
            return res.json({success: false, message: "email was not found"});
        }
        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.resetOtp = otp;
        user.resetOtpExpiredAt= Date.now() + 15 * 60 * 1000;
        await user.save();
        
        const mailOptions =
        {
            from: process.env.SENDER_EMAIL,
            to: user.email, 
            subject: 'Password Reset Verification OTP',
            text: `Your otp is ${otp}. Verify your account using this OTP`,
        }
        await transporter.sendMail(mailOptions);
        res.json({success: true, message: 'Verification OTP send on your E-Mail Address'});
    }
    catch(error)
    {
        return res.json({success: false, message: error.message});
    }
}
export const resetPassword = async (req, res)=>
{
    const {email, otp, newPassword} = req.body;
    if(!email || !otp || !newPassword)
    {
        return res.json({success: false, message: "details missing"});
    }
    try 
    {
        const user = await userModel.findOne({email});
        if(!user)
        {
            return res.json({success: false, message: "Email not found"});
        }
        if(user.resetOtp === '' || user.resetOtp !== otp)
        {
            return res.json({success: false, message: "otp issues"})
        }
        const hashPassword = await bcrypt.hash(newPassword,10);
        user.resetOtp = '';
        user.resetOtpExpiredAt = 0;
        user.password = hashPassword;
        await user.save();
        return res.json({success: true, message:"successfuly reset password"});


    }
    catch(error)
    {
        return res.json({success: false, message: error.message});
    }

}