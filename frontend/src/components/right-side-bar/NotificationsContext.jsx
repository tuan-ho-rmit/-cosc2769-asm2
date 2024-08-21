import {createContext, useEffect, useState} from "react";

const NotificationsContext = createContext();

const NotificationsProvider = ({ children }) => {

    const [notifications, setNotifications] = useState([]);
    const [unreadNotifications, setUnreadNotifications] = useState(0);
    const [url, setUrl] = useState("");

    const [pendingGroups, setPendingGroups] = useState([]); // State for pending groups

    // Array of URLs to fetch data from consequentially
    // const urlsToFetch = [
    //     'http://localhost:3000/api/groups',
    //     'http://localhost:3000/api/users',
    //     'http://localhost:3000/api/posts',
    // ];




    // fetch notification from backend
    const fetchNotification = async () => {
        try {

            const response1 = await fetch('http://localhost:3000/api/groups', {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                }
            });
            if (!response1.ok) {
                throw new Error(`HTTP error! status: ${response1.status}`);
            }
            const groupsData = await response1.json();
            console.log('Fetched result for groups: ', groupsData);


            // Filter function to get only groups with "pending" status
            const filterPendingGroups = (groupsData) => {
                return groupsData.filter(data => data.status === "pending");
            };

            // Apply the filter function to get pending groups
            const filteredGroup = filterPendingGroups(groupsData);
            setPendingGroups(filteredGroup)
            console.log('pending groups:', pendingGroups);



            const response2 = await fetch('http://localhost:3000/api/posts', {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                }
            });
            if (!response2.ok) {
                throw new Error(`HTTP error! status: ${response2.status}`);
            }
            const postsData = await response2.json();
            console.log('Fetched result for posts: ', postsData);


            // todo: append the new notifications to the existing state
            // setNotifications(prevNotifications => [...prevNotifications, ...result]);

            // TODO: update unread notifications count
            // setUnreadNotifications(prevUnread => prevUnread + result.filter(notifications))

        } catch (error) {
            console.error('Error fetching notifications:', error.message);
        }
    }

    // const fetchSequentially = async () => {
    //     let currentUrlIndex = 0;
    //     while (currentUrlIndex < urlsToFetch.length) {
    //         setUrl(urlsToFetch[currentUrlIndex])
    //         await fetchNotification(url);
    //         currentUrlIndex += 1;
    //     }
    // }


    useEffect(() => {
        // // Initial sequential fetch
        // fetchSequentially().then(() => {
        //
        //     // Start periodic fetching after initial sequence completes
        //     const intervalId = setInterval(() => {
        //         fetchNotification(url);
        //     }, 60000); // Fetch every 60 seconds
        //
        //     return () => clearInterval(intervalId); // Cleanup on unmount
        // });


        fetchNotification()
        const intervalId = setInterval(() => {
            fetchNotification()
            console.log('after 60 seconds:')
        }, 60000); // Pulling every 60 seconds
        return () => clearInterval(intervalId); // Cleanup on component unmount

    }, []); // re-fetch if url changes

    // function to update the url
    // const updateNotificationsUrl = (newUrl) => {
    //     setUrl(newUrl);
    // }

    const value = {
        notifications,
        unreadNotifications,
        pendingGroups
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
