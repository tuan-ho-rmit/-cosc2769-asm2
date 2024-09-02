import Notification from "../models/Notification.js";

export const createNoti = async (notiTitle, userIds, status, activityUrl) => {
    try {
        const newNoti = new Notification({
            notiTitle,
            userIds,
            status: 'unread',
            activityUrl,
        });

        console.log(newNoti)
        const savedNoti = await newNoti.save();
        // res.status(201).json(savedNoti);
    } catch (err) {
        console.error(err);
        // res.status(500).json({ message: 'Failed to create the notification: ', error: err.message });
    }
};