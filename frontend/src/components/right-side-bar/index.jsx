import React, {useContext} from 'react'
import { NotificationsContext } from './NotificationsContext.jsx'
import {NavLink} from "react-router-dom";

export default function RightSideBar() {
    const {notifications, markAsRead} = useContext(NotificationsContext);

    const handleNotificationClick = async (notificationId) => {
        await markAsRead(notificationId);
    };

    return (
        <>
            <div className='bg-black h-[100vh] w-[250px] right-0 border-white border-l-1 overflow-y-auto'>
                <nav>
                    <ul>

                        {notifications.map((notification) => (
                            <li key={notification._id}
                                className={`p-2 border-b border-white text-white ${notification.status === 'unread' ? 'notification-unread' : 'notification-read'}`}
                            onClick={() => handleNotificationClick(notification._id)}
                            >
                                <NavLink to={notification.activityUrl}>
                                    {notification.notiTitle}
                                    <br/>
                                    {new Date(notification.createdAt).toLocaleString(undefined, {
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit'
                                    })}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </>
    )
}