import React, {useContext, useEffect, useState} from 'react';
import {NotificationsContext} from '../right-side-bar/NotificationsContext';
import {useAuth} from '../../provider/AuthProvider'

export default function Header() {
    // get notifications dât and state from NotificationsContext
    const {notifications, setOpen, open} = useContext(NotificationsContext);
    const unreadCount = notifications.filter((notification) => notification.status === 'unread').length; // calculate number of unread
    const {user} = useAuth() // get user data from AuthProvider Context

    const handleAvatarClick = () => {
        if (user) {
            window.location.href = '/mydetail'; // redirect to user's profile page
        }
    };

    return (
        <>
            <div className='bg-grey text-center h-[50px] border-b-1 border-white flex flex-row items-center'>
                <div className='basis-1/3 justify-start'>
                    {/*app logo*/}
                    <svg className="h-[30px] w-[30px] text-white mx-8" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor"
                         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                    </svg>
                </div>
                {user && (
                    <div className='basis-2/3 flex flex-nowrap justify-end mr-4' style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        gap: "8px"
                    }}>
                        <div className="relative" style={{marginRight: '16px', cursor: 'pointer'}}
                             onClick={() => setOpen(!open)}>
                            {/*notification icon*/}
                            <svg class="size-8" className="h-[32px] w-[32px] text-white"
                                 xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                 stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                      d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"/>
                            </svg>
                            {/*badge for unread notficiation count*/}
                            {unreadCount > 0 && (
                                <span
                                    class=" absolute top-0 left-5 bg-lightDanger text-danger text-[12px] font-medium px-1.5 py-0.4 rounded">
                  {unreadCount}
                </span>
                            )}
                        </div>

                        {/*User avatar*/}
                        <div className='mx-4'>
                            <img
                                src={user.avatar || '/Images/example2.png'}  // use session user avatar
                                className='w-8 h-8 ring-yellow ring-2 rounded-full cursor-pointer'
                                alt='User Avatar'
                                onClick={handleAvatarClick}
                            />
                        </div>
                        <p className='text-white'>
                            {user.firstName} {user.lastName} {/* display session user name */}
                        </p>
                    </div>
                )}
            </div>
        </>
    );
}
