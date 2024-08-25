import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    dateOfBirth: {
        type: Date,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    avatar: {
        type: String, // Base64 encoded string for avatar image
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user",
        required: true,
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active",
        required: true,
    },
    friendIds: { // func: sendReq (create a friendrq with pending status), acceptRq(modify created rq to accept status; push id to both the receiver and sender ), rejectRq
        type: [mongoose.Schema.Types.ObjectId],
        required: true,
        ref: 'User',
        default: []
    },
});



const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
