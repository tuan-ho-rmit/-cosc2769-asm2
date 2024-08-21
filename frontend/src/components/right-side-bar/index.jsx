import React, {useContext} from 'react'
import { NotificationsContext } from './NotificationsContext.jsx'
// import useNotifications from "./useNotifications.jsx";

export default function RightSideBar() {
    // const {notifications, unreadNotifications, updateNotificationsUrl} = useNotifications();
    const {notifications, unreadNotifications, pendingGroups} = useContext(NotificationsContext);


    return (
        <>
            <div className='conent-end bg-black h-[100vh] w-[250px] right-0 absolute border-white border-l-1'>
            {/*<div className='bg-black h-[100vh] w-[250px] border-white border-l-1'>*/}
                <nav>
                    <ul>
                        {pendingGroups.length > 0 ? (
                            pendingGroups.map((group) => (
                                <li key={group.id}
                                    className='p-2 border-b border-white bg-black text-white'>
                                </li>
                            ))
                        ) : (
                            <li>
                                No Pending Group
                            </li>
                        )}
                    </ul>
                </nav>
            </div>
        </>
    )
}


//------------------------------------------------------
// draft

    // const {notifications, markAsRead} = useContext(NotificationContext)
    //
    // const handleNotificationClick = (notification) => {
    //     markAsRead(notification.id)
    //     window.location.href = notification.link // redirect to page
    // }
    //
    // return (
    //     <>
    //         <div className='conent-end bg-black h-[100vh] w-[250px] right-0 absolute border-white border-l-1'>
    //             <nav>
    //                 <ul>
    //                     {notifications.map((notification) => (
    //                         <li key={notification.id}
    //                             className={`p-2 border-b border-white ${notification.read ? 'bg-black text-white' : 'bg-yellow'}`}
    //                             onClick={() => handleNotificationClick(notification)}>
    //                         >
    //                             {notification.content}
    //                         </li>
    //                     ))}
    //                 </ul>
    //             </nav>
    //         </div>
    //     </>
    // )



    // const notifications = [
    //     {id: 1, type: 'friend_request', content: 'Mike sent you a friend request', read:false},
    //     {id: 2, type: 'reaction', content: 'Mike reacted to your post', read:false},
    //     {id: 3, type: 'group_invite', content: 'You were invited to Group "Full Stack Development Group"', read:true},
    // ]


    // return (
    //     <>
    //         <div className=' bg-black h-[100vh] w-[250px] right-0 absolute border-white border-l-1'>
    //             <nav>
    //                 <ul>
    //                     {notifications.map((notification) => (
    //                         <li key={notification.id} className={`p-2 border-b border-white ${notification.read ? 'bg-black text-white' : 'bg-yellow'}`}>
    //                             {notification.content}
    //                         </li>
    //                     ))}
    //                 </ul>
    //             </nav>
    //         </div>
    //     </>
    // )

