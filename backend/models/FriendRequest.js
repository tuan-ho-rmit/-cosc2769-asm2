import mongoose from 'mongoose';


const friendRequestSchema = new mongoose.Schema({
        fromId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        toId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        status: {
            type: String,
            enum: ["pending", "accepted", "rejected"],
            default: "pending",
            required: true,
        },
    },
    {timestamps: true})


const FriendRequest = mongoose.model("friendRequest", friendRequestSchema);
export default FriendRequest;