export async function creatNotificationService( {
    notiTitle,
    description = '',
    userIds = [],
    status = 'unread',
    activityType,
    activityUrl
            // refer to notificationDraft.jsx and mongoDB's notifications collection for filling in each the attribute.
}) {
    const notificationData = {
        notiTitle,
        description,
        userIds,
        status,
        activityType,
        activityUrl,
    };
    try {
        const response = await fetch('http://localhost:3000/api/notifications', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify(notificationData),
    });
        if (!response.ok) {
        throw new Error (`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        console.log('Notification created:', result);
        return result;
    } catch (error) {
        console.error('Error creating notification:', error.message);
        throw error;
    }
}
