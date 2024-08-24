import Notification from "../models/Notification.js";


export const createNoti = async (req, res) => {
    try {
        const { notiTitle, description, userIds, status, activityType, timeSent, activityUrl } = req.body;

        const newNoti = new Notification({
            notiTitle,
            description,
            userIds,
            status: 'unread',
            activityType,
            timeSent,
            activityUrl,
        });

        const savedNoti = await newNoti.save();
        res.status(201).json(savedNoti);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to create the notification: ', error: err.message });
    }
};

export const getAllNoti = async (req, res) => {
    try {
        console.log('testing getall noti')
        const notifications = await Notification.find().populate('userIds');
        res.status(200).json(notifications);
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'failed to fetch groups', error: err.message})
    }
}

export const readNoti = async (req, res) => {
    try {
        console.log(getNoti(req.params.id))
    } catch (err) {
        console.error(err);
    }
}
