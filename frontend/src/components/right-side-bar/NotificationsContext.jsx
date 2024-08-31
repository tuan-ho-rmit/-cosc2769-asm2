import {createContext, useEffect, useState} from "react";

const NotificationsContext = createContext();

const NotificationsProvider = ({ children }) => {

    const [notifications, setNotifications] = useState([]);
    const [unreadNotifications, setUnreadNotifications] = useState(0);
    const [recipentUser, setRecipentUser] = useState(null);


    // fetch notification from backend
    const fetchNotification = async () => {
        try {

            const response1 = await fetch('http://localhost:3000/api/notifications', {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                }
            });
            if (!response1.ok) {
                throw new Error(`HTTP error! status: ${response1.status}`);
            }
            const notificationsData = await response1.json();
            console.log('Fetched result for notificationsData from notificationsContext: ', notificationsData);
            // fetch notification for the current user

            const userResponse = await fetch(`http://localhost:3000/api/auth/user`, {
                method: "GET",
                credentials: "include",
            })
            if (!userResponse.ok) {
                console.log('Error fetching current user info')
                throw new Error(`HTTP error! status: ${userResponse.status}`);
            }
            const currentUserData = await userResponse.json();
            const currentUserId = currentUserData.id;
            console.log( 'Currentuserid: ', currentUserId);


            // set notifications
            setNotifications(notificationsData);






            // fetch name for each user
            notificationsData.forEach(notification => {
                notification.userIds.forEach(user => {
                    console.log('Fetched notification user\'name from notificationsContext:', user.name);
                })}
            )



            // todo: append the new notifications to the existing state
            // setNotifications(prevNotifications => [...prevNotifications, ...result]);

            // TODO: update unread notifications count
            // setUnreadNotifications(prevUnread => prevUnread + result.filter(notifications))

        } catch (error)
            {
            console.error('Error fetching notifications:', error.message);
        }
    }


    useEffect(() => {
        fetchNotification()
        const intervalId = setInterval(() => {
            fetchNotification()
            console.log('after 60 seconds:')
        }, 60000); // Pulling every 60 seconds
        return () => clearInterval(intervalId); // Cleanup on component unmount

    }, []); // re-fetch if url changes

    const value = {
        notifications,
        unreadNotifications
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

// const [pendingGroups, setPendingGroups] = useState([]); // State for pending groups
//
// // Filter function to get only groups with "pending" status
// const filterPendingGroups = (groupsData) => {
//     return groupsData.filter(data => data.status === "pending");
// };
//
// // Apply the filter function to get pending groups
// const filteredGroup = filterPendingGroups(groupsData);
// setPendingGroups(filteredGroup)


// console.log('filtered groups:', filteredGroup);
// console.log('pending groups:', pendingGroups);
//
// // count pending groups
// const countPendingGroups = filteredGroup.length

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
