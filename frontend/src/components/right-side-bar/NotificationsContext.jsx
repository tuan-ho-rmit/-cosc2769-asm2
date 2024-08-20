import {createContext, useEffect, useState} from "react";

const NotificationsContext = createContext();

const NotificationsProvider = ({ children }) => {

    const [notifications, setNotifications] = useState([]);
    const [unreadNotifications, setUnreadNotifications] = useState(0);
    const [url, setUrl] = useState("");

    // Array of URLs to fetch data from consequentially
    const urlsToFetch = [
        'http://localhost:3000/api/groups',
        'http://localhost:3000/api/users',
        'http://localhost:3000/api/posts',
    ];




    // fetch notification from backend
    const fetchNotification = async (e) => {
        try {

            const response = await fetch(e, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            console.log('Fetched result', result);

            // todo: append the new notifications to the existing state
            // setNotifications(prevNotifications => [...prevNotifications, ...result]);

            // TODO: update unread notifications count
            // setUnreadNotifications(prevUnread => prevUnread + result.filter(notifications))

        } catch (error) {
            console.error('Error fetching notifications:', error.message);
        }
    }

    const fetchSequentially = async () => {
        let currentUrlIndex = 0;
        while (currentUrlIndex < urlsToFetch.length) {
            setUrl(urlsToFetch[currentUrlIndex])
            await fetchNotification(url);
            currentUrlIndex += 1;
        }
    }


    useEffect(() => {
        // Initial sequential fetch
        fetchSequentially().then(() => {

            // Start periodic fetching after initial sequence completes
            const intervalId = setInterval(() => {
                fetchNotification(url);
            }, 6000); // Fetch every 6 seconds

            return () => clearInterval(intervalId); // Cleanup on unmount
        });


        // fetchNotification(url)
        // const intervalId = setInterval(() => {
        //     fetchNotification(url)
        // }, 60000); // Pulling every 60 seconds
        // return () => clearInterval(intervalId); // Cleanup on component unmount

    }, [url]); // re-fetch if url changes

    // function to update the url
    const updateNotificationsUrl = (newUrl) => {
        setUrl(newUrl);
    }

    const value = {
        notifications, unreadNotifications, updateNotificationsUrl
    }

    return (
        <NotificationsContext.Provider value={value}>
            {children}
        </NotificationsContext.Provider>
    )
}

export default NotificationsProvider;
export { NotificationsContext };



// ----------------------------------------------
// draft

// export const NotificationsProvider = ({children}) => {
//     const [notifications, setNotifications] = useState([]); // holds the list of notification
//     const [unreadCount, setUnreadCount] = useState(0) // tracks the number of unread notifications
//
//     // fetch notification from the backend
//     const fetchNotifications = async () => {
//         try {
//             const response = await fetch(`...`);
//             setNotifications(response.data);
//             setUnreadCount(response.data.filer(notification => !notification.read).length);
//         } catch (error) {
//             console.log('error fetching noti', error);
//         }
//     }
//
//     // mark notification as read
//     const markAsRead = async (id) => {
//         try {
//             await axios.post('', {id})
//             fetchNotifications(); // refresh after marking as read
//         } catch(error) {
//             console.log('error marking read noti', error);
//         }
//     }
//
//     useEffect(() => {
//         fetchNotifications();
//         const intervalId = setInterval(fetchNotifications, 60000); // Polling every 60 seconds
//         return () => clearInterval(intervalId); // Cleanup on component unmount
//     }, []);
//
//     return (
//         <NotificationsContext.Provider value={{ notifications, unreadCount, markAsRead }}>
//             {children}
//         </NotificationsContext.Provider>
//     )
