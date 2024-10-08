import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
        notiTitle: {
            type: String,
            required: true,
        },
        userIds: {
            type: [mongoose.Schema.Types.ObjectId],
            required: true,
            ref: 'User',
            default: []
        },
        status: {
            type: String,
            enum: ["read", "unread"],
            default: "unread",
            required: true,
        },
        activityUrl: {
            type: String,
            required: true,
        },

    },
    {timestamps: true});

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
