import {useContext, useEffect, useState} from "react";
import error from "eslint-plugin-react/lib/util/error.js";

const NotificationsContext = useContext();

export const NotificationsProvider = ({children}) => {
    const [notifications, setNotifications] = useState([]); // holds the list of notification
    const [unreadCount, setUnreadCount] = useState(0) // tracks the number of unread notifications

    // fetch notification from the backend
    const fetchNotifications = async () => {
        try {
            const response = await fetch(`...`);
            setNotifications(response.data);
            setUnreadCount(response.data.filer(notification => !notification.read).length);
        } catch (error) {
            console.log('error fetching noti', error);
        }
    }

    // mark notification as read
    const markAsRead = async (id) => {
        try {
            await axios.post('', {id})
            fetchNotifications(); // refresh after marking as read
        } catch(error) {
            console.log('error marking read noti', error);
        }
    }

    useEffect(() => {
        fetchNotifications();
        const intervalId = setInterval(fetchNotifications, 60000); // Polling every 60 seconds
        return () => clearInterval(intervalId); // Cleanup on component unmount
    }, []);

    return (
        <NotificationsContext.Provider value={{ notifications, unreadCount, markAsRead }}>
            {children}
        </NotificationsContext.Provider>
    )
}