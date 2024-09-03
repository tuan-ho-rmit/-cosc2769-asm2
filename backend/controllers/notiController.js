import Notification from "../models/Notification.js";


// export const createNoti = async (req, res) => {
//     try {
//         const { notiTitle, userIds, status, activityUrl } = req.body;
//
//         const newNoti = new Notification({
//             notiTitle,
//             userIds,
//             status: 'unread',
//             activityUrl,
//         });
//
//         console.log(newNoti)
//         const savedNoti = await newNoti.save();
//         res.status(201).json(savedNoti);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: 'Failed to create the notification: ', error: err.message });
//     }
// };

// export const getAllNoti = async (req, res) => {
//     try {
//         console.log(req.session)
//         const userId = req.session.user._id
//         const notifications = await Notification.find({userIds: userId})
//         res.status(200).json(notifications);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({message: 'failed to fetch groups', error: err.message})
//     }
// }

export const getAllNoti = async (req, res) => {
    try {

        if (!req.session.user ) {
            // Handle the case where userId is not available
            return res.status(400).json({ message: 'User ID is missing' });
        } else {
            const userId = req.session?.user?.id || null; // Get the user ID from session
            // Find notifications where `userIds` array contains the `userId`
            const notifications = await Notification.find({ userIds: userId });

            if (notifications.length === 0) {
                // Handle the case where no notifications are found
                return res.status(404).json({ message: 'No notifications found for this user' });
            }

            res.status(200).json(notifications);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch notifications', error: err.message });
    }
};



export const changeNotiStatus = async (req, res) => {
    try {
        const {notificationId} = req.params;
        const notificationData = await Notification.findById(notificationId)
        if(!notificationData) {
            return res.status(404).json({message: "Notification not found"})
        }
        notificationData.status = 'read'
        await notificationData.save()
        res.status(200).json(notificationData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to update notification status', error: err.message });
    }
}
