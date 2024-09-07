import React, { useContext } from 'react'
import { NotificationsContext } from './NotificationsContext.jsx'
import { NavLink } from "react-router-dom";
import './Notifications.css';

export default function RightSideBar() {
    const { notifications, markAsRead, open } = useContext(NotificationsContext);

    const handleNotificationClick = async (notificationId) => {
        await markAsRead(notificationId);
    };

    return (
        <>
            <div className='bg-black h-[100vh] w-[250px] pb-[50px] right-0 border-white border-l-1 overflow-y-auto'
                style={{ display: open ? '' : 'none' }}
            >
                <nav>
                    <ul>

                        {notifications.length ? notifications.map((notification) => (
                            <li key={notification._id}
                                className={`p-2 cursor-pointer border-b border-white text-white ${notification.status === 'unread' ? 'notification-unread hover:bg-primary transition-colors duration-200' : 'notification-read hover:bg-grey-300 transition-colors duration-300'}`}
                                onClick={() => handleNotificationClick(notification._id)}
                            >
                                <NavLink to={notification.activityUrl}>
                                    {notification.notiTitle}
                                    <br />
                                    {new Date(notification.createdAt).toLocaleString(undefined, { 
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit'
                                    })}
                                </NavLink>
                            </li>
                        )) : (
                            <li className="p-4 text-white text-center">
                                No notifications available
                            </li>
                        )}
                    </ul>
                </nav>
            </div>
        </>
    )
}