import React, { useEffect } from 'react';
import Header from '../header';
import LeftSideBar from '../left-side-bar';
import { Outlet, useNavigate } from 'react-router-dom';
import RightSideBar from "../right-side-bar";
import NotificationsProvider from "../right-side-bar/NotificationsContext.jsx";
import { useAuth } from '../../provider/AuthProvider.jsx';

export default function PrivateLayout() {
    const { user, isFetchedUser } = useAuth()
    const navigate = useNavigate()
    useEffect(() => {
        console.log("🚀 ~ useEffect ~ isFetchedUser:", isFetchedUser)
        if (isFetchedUser && !user) {
            navigate("/login");
        }
    }, [user, isFetchedUser])

    return (
        <>
            <NotificationsProvider>
                <div className='flex flex-col bg-black h-[100vh]'>
                    <div className='h-auto'>
                        <Header />
                    </div>
                    <div className='flex flex-row w-[100%] overflow-hidden' style={{ minHeight: "calc(100vh - 50px)" }}>
                        <LeftSideBar />
                        <div className='flex-1 overflow-auto'>
                            <Outlet />
                        </div>
                        <RightSideBar />
                    </div>
                </div>
                {/*<div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: "black" }}>*/}
                {/*    <Header />*/}

                {/*    <div style={{ display: 'flex', flexDirection: 'row', width:'100%', overflow: 'hidden', minHeight: 'calc(100vh - 64px)' }}>*/}
                {/*        <LeftSideBar />*/}
                {/*        <div style={{ flex: 1, overflow: 'auto' }}>*/}
                {/*            <Outlet />*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}
            </NotificationsProvider>

        </>
    );
}
