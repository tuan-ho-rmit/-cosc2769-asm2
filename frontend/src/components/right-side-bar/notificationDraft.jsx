import {creatNotificationService} from 'NotificationService.js'

export default async function notificationDraft() {
    await creatNotificationService({
        notiTitle: "reacted to your post", //"requested to join your group" || "commented on your post"|| etc.
        description: "like", //empty
        userIds: ["66bdf794ae829e4e38da18f8"], //pass in userId
        activityType: "reaction", // "reaction" || "comment" || "group"
        activityUrl: `/posts`, // path to put to NavLink
    });
}