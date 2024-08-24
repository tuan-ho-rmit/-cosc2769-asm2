import {creatNotificationService} from 'NotificationService.js'

// sample data
export default async function notificationDraft() {
    await creatNotificationService({
        notiTitle: "reacted to your post", //"requested to join your group" || "commented on your post"|| etc.
        description: "like", // expanded description for the notification title/ not important
        userIds: ["66bdf794ae829e4e38da18f8"], // user's ID
        activityType: "reaction", // type of notification: "reaction" || "comment" || "group"
        activityUrl: `/posts`, // NavLink path
    });
}