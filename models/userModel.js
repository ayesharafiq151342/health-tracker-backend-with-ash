import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    type:{type:Boolean, default:0},
    status:{type:Boolean, default:1},
    verifyOtp: {type: String, default:''},
    verifyOtpExpireAt: {type: Number, default: 0},
    isAccountVerified: {type: Boolean, default: false},
    resetOtp: {type: String, default: ''},
    resetOtpExpiredAt: {type: Number, default: 0},
    isAdmin: { type: Boolean, default: false },
});

const userModel = mongoose.models.user || mongoose.model('user', userSchema);
export default userModel;