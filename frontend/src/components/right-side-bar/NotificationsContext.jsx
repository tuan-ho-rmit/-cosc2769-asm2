import {createContext, useEffect, useState} from "react";

const NotificationsContext = createContext();

const NotificationsProvider = ({children}) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadNotifications, setUnreadNotifications] = useState(0);
    const [open, setOpen] = useState(false)

    // fetch notification from backend
    const fetchNotification = async () => {
        try {
            console.log('bug')
            const response1 = await fetch('http://localhost:3000/api/notifications', {
                method: 'GET',
                credentials: "include",
                headers: {
                    'Content-type': 'application/json',
                }
            });
            if (!response1.ok) {
                throw new Error(`HTTP error! status: ${response1.status}`);
            }
            const notificationsData = await response1.json();
            console.log('Fetched result for notificationsData from notificationsContext: ', notificationsData);

            // set notifications
            setNotifications(notificationsData);
        } catch (error) {
            console.error('Error fetching notifications:', error.message);
        }
    }

    // Function to mark a notification as read
    const markAsRead = async (notificationId) => {
        try {
            // Send request to update the notification status to "read"
            const response = await fetch(
                `http://localhost:3000/api/notifications/${notificationId}/read`,
                {
                    method: "PATCH",
                    credentials: "include",
                    headers: {
                        "Content-type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`Failed to mark notification as read.`);
            }

            const updatedNotification = await response.json();
            console.log('Notification marked as read:', updatedNotification);
            fetchNotification()
        } catch (error) {
            console.error("Error marking notification as read:", error.message);
        }
    }

    useEffect(() => {
        fetchNotification()
        const intervalId = setInterval(() => {
            fetchNotification()
            console.log('after 60 seconds:')
        }, 5000); // fetch notifications every 5 seconds
        return () => clearInterval(intervalId); // Cleanup on component unmount

    }, []);

    const value = {
        notifications,
        unreadNotifications,
        markAsRead,
        setOpen,
        open
    }

    return (
        <NotificationsContext.Provider value={value}>
            {children}
        </NotificationsContext.Provider>
    )
}

export default NotificationsProvider;
export {NotificationsContext};