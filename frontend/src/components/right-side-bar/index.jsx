import React, {useContext} from 'react'
import { NotificationsContext } from './NotificationsContext.jsx'
import {NavLink} from "react-router-dom";

export default function RightSideBar() {
    // const {notifications, unreadNotifications, updateNotificationsUrl} = useNotifications();
    const {notifications, unreadNotifications, pendingGroups} = useContext(NotificationsContext);
    console.log('pending groups from rightsidebar: ', pendingGroups);

    return (
        <>

            {/*<div className='conent-end bg-black h-[100vh] w-[250px] right-0 absolute border-white border-l-1'>*/}
            <div className='bg-black h-[100vh] w-[250px] right-0 border-white border-l-1 overflow-y-auto'>
                <nav>
                    <ul>
                        <div className='p-2 border-b border-white bg-black text-yellow'>
                            Group Notifications: {unreadNotifications}
                        </div>
                        {pendingGroups.length > 0 ? (
                            pendingGroups.map((group) => (
                                <li key={group._id}
                                    className='p-2 border-b border-white bg-black text-white'>
                                    <NavLink to='/groups'>
                                        <div>
                                            Group: {group.groupName}
                                        </div>
                                        <div>
                                            Created on: {new Date(group.createdAt).toLocaleString(undefined, { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            <br/>
                                            Status: {group.status}
                                        </div>
                                    </NavLink>
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

