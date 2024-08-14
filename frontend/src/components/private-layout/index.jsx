import React from 'react';
import Header from '../header';
import LeftSideBar from '../left-side-bar';
import { Outlet } from 'react-router-dom';
import RightSideBar from "../right-side-bar";

export default function PrivateLayout() {
    return (
        <>
            <div className='flex flex-col bg-black h-[100vh]'>
                <Header />
                <div className='flex flex-row w-[100%] overflow-hidden min-h-[calc(100vh - 64px)]'>
                    <LeftSideBar />
                    <RightSideBar />
                    <div className='flex-1 overflow-auto'>
                        <Outlet />
                    </div>
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
        </>
    );
}
