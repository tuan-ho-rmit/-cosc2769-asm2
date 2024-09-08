import React, {useEffect} from 'react';
import Header from '../header';
import LeftSideBar from '../left-side-bar';
import {Outlet, useNavigate} from 'react-router-dom';
import RightSideBar from "../right-side-bar";
import NotificationsProvider from "../right-side-bar/NotificationsContext.jsx";
import {useAuth} from '../../provider/AuthProvider.jsx';

export default function PrivateLayout() {
    // get user data and authentication status
    const {user, isFetchedUser} = useAuth()
    const navigate = useNavigate()

    // redirect to login if user is not authenticated
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
                        {/*render Header component*/}
                        <Header/>
                    </div>
                    <div className='flex flex-row w-[100%] overflow-hidden' style={{minHeight: "calc(100vh - 50px)"}}>
                        {/*render LeftSideBar component*/}
                        <LeftSideBar/>
                        <div className='flex-1 overflow-auto'>
                            <Outlet/>
                        </div>
                        {/*render RightSideBar component*/}
                        <RightSideBar/>
                    </div>
                </div>
            </NotificationsProvider>

        </>
    );
}
