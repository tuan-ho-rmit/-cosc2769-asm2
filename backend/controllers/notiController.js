import Notification from "../models/Notification.js";

// function to get all notifications for a user
export const getAllNoti = async (req, res) => {
    try {
        // check if the user id is available in the session
        if (!req.session.user) {
            // Handle the case where userId is not available
            return res.status(400).json({message: 'User ID is missing'});
        } else {
            const userId = req.session?.user?.id || null; // Get the user ID from session

            // Find notifications where `userIds` array contains the `userId`
            const notifications = await Notification.find({userIds: userId}).sort({createdAt: -1});

            if (notifications.length === 0) {
                // Handle the case where no notifications are found
                return res.status(404).json({message: 'No notifications found for this user'});
            }
            res.status(200).json(notifications);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Failed to fetch notifications', error: err.message});
    }
};

// function to mark a notification as read
export const changeNotiStatus = async (req, res) => {
    try {
        const {notificationId} = req.params; // get notification from request param
        //find notification by id
        const notificationData = await Notification.findById(notificationId)

        if (!notificationData) {
            return res.status(404).json({message: "Notification not found"})
        }
        notificationData.status = 'read' // update status to read
        await notificationData.save()
        res.status(200).json(notificationData);
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Failed to update notification status', error: err.message});
    }
}
